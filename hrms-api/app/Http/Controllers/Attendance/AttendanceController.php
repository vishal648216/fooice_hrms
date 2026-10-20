<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Attendance Controller — Clock In/Out, Daily Records, Reports
 * Routes: /api/attendance/*
 */
class AttendanceController extends Controller
{
    /** POST /api/attendance/clock-in */
    public function clockIn(Request $request): JsonResponse
    {
        $user     = $request->user();
        $today    = now()->toDateString();
        $tenantId = $user->tenant_id;

        // Check already clocked in today
        $existing = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($existing && $existing->clock_in) {
            return response()->json([
                'success' => false,
                'message' => 'You have already clocked in today at ' . Carbon::parse($existing->clock_in)->format('h:i A') . '.',
            ], 422);
        }

        $request->validate([
            'location' => 'nullable|array',
            'location.lat' => 'nullable|numeric',
            'location.lng' => 'nullable|numeric',
            'location.address' => 'nullable|string',
            'notes' => 'nullable|string|max:500',
        ]);

        // Determine status (ON_TIME vs LATE — simple check: after 9:30 AM)
        $clockInTime   = now();
        $expectedStart = Carbon::today()->setTime(9, 30, 0);
        $status        = $clockInTime->gt($expectedStart) ? 'LATE' : 'ON_TIME';

        $attendance = Attendance::updateOrCreate(
            ['tenant_id' => $tenantId, 'user_id' => $user->id, 'date' => $today],
            [
                'clock_in'          => $clockInTime,
                'clock_in_ip'       => $request->ip(),
                'clock_in_location' => $request->location,
                'status'            => $status,
                'notes'             => $request->notes,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Clocked in successfully at ' . $clockInTime->format('h:i A') . '.',
            'data'    => [
                'id'          => $attendance->id,
                'date'        => $attendance->date,
                'clock_in'    => $attendance->clock_in,
                'status'      => $attendance->status,
                'clock_in_location' => $attendance->clock_in_location,
            ],
        ]);
    }

    /** POST /api/attendance/clock-out */
    public function clockOut(Request $request): JsonResponse
    {
        $user  = $request->user();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (! $attendance || ! $attendance->clock_in) {
            return response()->json([
                'success' => false,
                'message' => 'You have not clocked in today.',
            ], 422);
        }

        if ($attendance->clock_out) {
            return response()->json([
                'success' => false,
                'message' => 'You have already clocked out today.',
            ], 422);
        }

        $clockOut    = now();
        $clockIn     = Carbon::parse($attendance->clock_in);
        $totalHours  = round($clockIn->diffInMinutes($clockOut) / 60, 2);
        $standardHrs = 9.0;
        $overtime    = max(0, $totalHours - $standardHrs);

        // Determine final status
        $status = $attendance->status;
        if ($totalHours < 8) {
            $status = $attendance->status === 'ON_TIME' ? 'EARLY_LEAVE' : $attendance->status;
        }

        $attendance->update([
            'clock_out'      => $clockOut,
            'clock_out_ip'   => $request->ip(),
            'total_hours'    => $totalHours,
            'overtime_hours' => $overtime,
            'status'         => $status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Clocked out successfully. Total: ' . $totalHours . ' hrs.',
            'data'    => [
                'id'             => $attendance->id,
                'date'           => $attendance->date,
                'clock_in'       => $attendance->clock_in,
                'clock_out'      => $attendance->clock_out,
                'total_hours'    => $attendance->total_hours,
                'overtime_hours' => $attendance->overtime_hours,
                'status'         => $attendance->status,
            ],
        ]);
    }

    /** GET /api/attendance/today */
    public function today(Request $request): JsonResponse
    {
        $user  = $request->user();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        return response()->json([
            'success' => true,
            'data'    => $attendance,
        ]);
    }

    /** GET /api/attendance/my — My attendance history */
    public function myHistory(Request $request): JsonResponse
    {
        $request->validate([
            'month' => 'nullable|integer|between:1,12',
            'year'  => 'nullable|integer|min:2020',
        ]);

        $month = $request->month ?? now()->month;
        $year  = $request->year  ?? now()->year;

        $records = Attendance::where('user_id', $request->user()->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'desc')
            ->get();

        // Summary stats
        $total         = $records->count();
        $present       = $records->whereNotIn('status', ['ABSENT', 'ON_LEAVE'])->count();
        $totalHrs      = round($records->sum('total_hours'), 2);
        $lateCount     = $records->where('status', 'LATE')->count();
        $overtimeHrs   = round($records->sum('overtime_hours'), 2);

        return response()->json([
            'success' => true,
            'data'    => [
                'records' => $records,
                'summary' => [
                    'total_days'     => $total,
                    'present_days'   => $present,
                    'absent_days'    => $total - $present,
                    'late_count'     => $lateCount,
                    'total_hours'    => $totalHrs,
                    'overtime_hours' => $overtimeHrs,
                    'month'          => $month,
                    'year'           => $year,
                ],
            ],
        ]);
    }

    /** GET /api/attendance — All employees (HR/Manager only) */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'date'          => 'nullable|date',
            'month'         => 'nullable|integer|between:1,12',
            'year'          => 'nullable|integer|min:2020',
            'department_id' => 'nullable|integer',
            'user_id'       => 'nullable|integer',
            'status'        => 'nullable|string',
        ]);

        $query = Attendance::with(['user:id,name,email,avatar,employee_code,department_id', 'user.department:id,name']);

        if ($request->filled('date')) {
            $query->where('date', $request->date);
        } elseif ($request->filled('month') || $request->filled('year')) {
            $month = $request->month ?? now()->month;
            $year  = $request->year  ?? now()->year;
            $query->whereYear('date', $year)->whereMonth('date', $month);
        } else {
            $query->where('date', now()->toDateString());
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('status')) {
            $query->where('status', strtoupper($request->status));
        }

        if ($request->filled('department_id')) {
            $query->whereHas('user', fn($q) => $q->where('department_id', $request->department_id));
        }

        $records = $query->orderBy('date', 'desc')
                         ->paginate($request->per_page ?? 30);

        return response()->json([
            'success' => true,
            'data'    => $records,
        ]);
    }

    /** GET /api/attendance/summary — Team overview for today */
    public function summary(Request $request): JsonResponse
    {
        $today    = $request->date ?? now()->toDateString();
        $tenantId = $request->user()->tenant_id;

        $totalEmployees = User::where('is_active', true)
            ->where('role', '!=', 'CLIENT')
            ->count();

        $todayAttendance = Attendance::with('user:id,name,avatar,employee_code')
            ->where('date', $today)
            ->get();

        $present  = $todayAttendance->whereNotIn('status', ['ABSENT', 'ON_LEAVE'])->count();
        $late     = $todayAttendance->where('status', 'LATE')->count();
        $onLeave  = $todayAttendance->where('status', 'ON_LEAVE')->count();
        $absent   = $totalEmployees - $present - $onLeave;
        $remote   = $todayAttendance->where('status', 'REMOTE')->count();

        return response()->json([
            'success' => true,
            'data'    => [
                'date'             => $today,
                'total_employees'  => $totalEmployees,
                'present'          => $present,
                'absent'           => max(0, $absent),
                'late'             => $late,
                'on_leave'         => $onLeave,
                'remote'           => $remote,
                'attendance_rate'  => $totalEmployees > 0
                    ? round(($present / $totalEmployees) * 100, 1)
                    : 0,
                'records'          => $todayAttendance,
            ],
        ]);
    }

    /** PATCH /api/attendance/{id} — Admin manual correction */
    public function update(Request $request, int $id): JsonResponse
    {
        $attendance = Attendance::findOrFail($id);

        $validated = $request->validate([
            'clock_in'   => 'nullable|date',
            'clock_out'  => 'nullable|date',
            'status'     => 'nullable|in:ON_TIME,LATE,EARLY_LEAVE,ABSENT,ON_LEAVE,REMOTE,HOLIDAY',
            'notes'      => 'nullable|string',
        ]);

        // Recalculate hours if times changed
        if (isset($validated['clock_in']) || isset($validated['clock_out'])) {
            $in  = Carbon::parse($validated['clock_in']  ?? $attendance->clock_in);
            $out = Carbon::parse($validated['clock_out'] ?? $attendance->clock_out);
            if ($in && $out) {
                $validated['total_hours']    = round($in->diffInMinutes($out) / 60, 2);
                $validated['overtime_hours'] = max(0, $validated['total_hours'] - 9);
            }
        }

        $validated['approved_by'] = $request->user()->id;
        $attendance->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Attendance record updated.',
            'data'    => $attendance->fresh('user'),
        ]);
    }

    /** GET /api/attendance/report — Monthly report */
    public function report(Request $request): JsonResponse
    {
        $request->validate([
            'month' => 'required|integer|between:1,12',
            'year'  => 'required|integer|min:2020',
        ]);

        $month = $request->month;
        $year  = $request->year;

        $employees = User::where('is_active', true)
            ->where('role', '!=', 'CLIENT')
            ->with(['attendances' => function ($q) use ($month, $year) {
                $q->whereMonth('date', $month)->whereYear('date', $year);
            }])
            ->get();

        $report = $employees->map(function ($emp) {
            $records     = $emp->attendances;
            $totalDays   = $records->count();
            $presentDays = $records->whereNotIn('status', ['ABSENT', 'ON_LEAVE'])->count();
            $totalHrs    = round($records->sum('total_hours'), 2);
            $lateCount   = $records->where('status', 'LATE')->count();
            $overtimeHrs = round($records->sum('overtime_hours'), 2);

            return [
                'employee_id'    => $emp->id,
                'name'           => $emp->name,
                'employee_code'  => $emp->employee_code,
                'present_days'   => $presentDays,
                'absent_days'    => $totalDays - $presentDays,
                'late_count'     => $lateCount,
                'total_hours'    => $totalHrs,
                'overtime_hours' => $overtimeHrs,
                'loss_of_pay_days' => max(0, 26 - $presentDays), // assuming 26 working days
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => [
                'month'   => $month,
                'year'    => $year,
                'report'  => $report,
            ],
        ]);
    }
}
