<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\LeaveAllocation;
use App\Models\Attendance;
use App\Models\Holiday;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Leave Management Controller
 * Handles leave types, allocations, requests, approvals
 * Routes: /api/leaves/*
 */
class LeaveController extends Controller
{
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LEAVE TYPES (HR Admin)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /** GET /api/leaves/types */
    public function leaveTypes(Request $request): JsonResponse
    {
        $types = LeaveType::all();

        return response()->json([
            'success' => true,
            'data'    => $types,
        ]);
    }

    /** POST /api/leaves/types */
    public function createLeaveType(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                => 'required|in:SICK,CASUAL,VACATION,MATERNITY,PATERNITY,COMPENSATORY,OTHER',
            'max_days_per_year'   => 'required|integer|min:0',
            'carry_forward_limit' => 'nullable|integer|min:0',
            'is_paid'             => 'nullable|boolean',
            'color'               => 'nullable|string|max:10',
        ]);

        $tenantId = $request->user()->tenant_id;

        // Check duplicate within tenant
        if (LeaveType::where('tenant_id', $tenantId)->where('name', $validated['name'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => "Leave type '{$validated['name']}' already exists.",
            ], 422);
        }

        $leaveType = LeaveType::create([
            'tenant_id'           => $tenantId,
            'name'                => $validated['name'],
            'max_days_per_year'   => $validated['max_days_per_year'],
            'carry_forward_limit' => $validated['carry_forward_limit'] ?? 0,
            'is_paid'             => $validated['is_paid'] ?? true,
            'color'               => $validated['color'] ?? '#6366f1',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Leave type created.',
            'data'    => $leaveType,
        ], 201);
    }

    /** PUT /api/leaves/types/{id} */
    public function updateLeaveType(Request $request, int $id): JsonResponse
    {
        $leaveType = LeaveType::findOrFail($id);

        $validated = $request->validate([
            'max_days_per_year'   => 'sometimes|integer|min:0',
            'carry_forward_limit' => 'nullable|integer|min:0',
            'is_paid'             => 'nullable|boolean',
            'color'               => 'nullable|string|max:10',
        ]);

        $leaveType->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Leave type updated.',
            'data'    => $leaveType,
        ]);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LEAVE BALANCE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /** GET /api/leaves/balance — My leave balances */
    public function myBalance(Request $request): JsonResponse
    {
        $user = $request->user();
        $year = $request->year ?? now()->year;

        $types  = LeaveType::all();
        $allocs = LeaveAllocation::where('user_id', $user->id)
            ->where('year', $year)
            ->get()
            ->keyBy('leave_type_id');

        $balance = $types->map(function ($type) use ($allocs) {
            $alloc     = $allocs->get($type->id);
            $total     = $alloc ? $alloc->total_days : $type->max_days_per_year;
            $used      = $alloc ? $alloc->used_days  : 0;
            $remaining = max(0, $total - $used);

            return [
                'leave_type_id'   => $type->id,
                'name'            => $type->name,
                'is_paid'         => $type->is_paid,
                'color'           => $type->color,
                'total_days'      => $total,
                'used_days'       => $used,
                'remaining_days'  => $remaining,
                'carry_forward'   => $type->carry_forward_limit,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => [
                'year'    => $year,
                'balance' => $balance,
            ],
        ]);
    }

    /** GET /api/leaves/balance/{userId} — Specific employee balance (HR) */
    public function employeeBalance(Request $request, int $userId): JsonResponse
    {
        $year   = $request->year ?? now()->year;
        $types  = LeaveType::all();
        $allocs = LeaveAllocation::where('user_id', $userId)
            ->where('year', $year)
            ->get()
            ->keyBy('leave_type_id');

        $balance = $types->map(function ($type) use ($allocs) {
            $alloc = $allocs->get($type->id);
            $total = $alloc ? $alloc->total_days : $type->max_days_per_year;
            $used  = $alloc ? $alloc->used_days  : 0;

            return [
                'leave_type_id'  => $type->id,
                'name'           => $type->name,
                'total_days'     => $total,
                'used_days'      => $used,
                'remaining_days' => max(0, $total - $used),
                'color'          => $type->color,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => ['year' => $year, 'user_id' => $userId, 'balance' => $balance],
        ]);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LEAVE REQUESTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /** GET /api/leaves — List leave requests */
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = LeaveRequest::with(['user:id,name,avatar,employee_code', 'leaveType', 'approver:id,name']);

        // Employees see only their own; HR/Managers see all
        if ($user->role === 'EMPLOYEE') {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', strtoupper($request->status));
        }

        if ($request->filled('user_id') && $user->role !== 'EMPLOYEE') {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('year')) {
            $query->whereYear('start_date', $request->year);
        }

        $requests = $query->orderBy('created_at', 'desc')
                          ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data'    => $requests,
        ]);
    }

    /** POST /api/leaves — Apply for leave */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date'    => 'required|date|after_or_equal:today',
            'end_date'      => 'required|date|after_or_equal:start_date',
            'reason'        => 'required|string|max:500',
            'document_path' => 'nullable|string',
        ]);

        $user      = $request->user();
        $tenantId  = $user->tenant_id;
        $startDate = Carbon::parse($validated['start_date']);
        $endDate   = Carbon::parse($validated['end_date']);

        // Calculate working days (exclude weekends + holidays)
        $holidays  = Holiday::whereBetween('date', [$startDate, $endDate])->pluck('date')->map(fn($d) => Carbon::parse($d)->toDateString())->toArray();
        $totalDays = 0;
        $period    = CarbonPeriod::create($startDate, $endDate);

        foreach ($period as $date) {
            if (! $date->isWeekend() && ! in_array($date->toDateString(), $holidays)) {
                $totalDays++;
            }
        }

        if ($totalDays === 0) {
            return response()->json([
                'success' => false,
                'message' => 'The selected dates fall on weekends or holidays.',
            ], 422);
        }

        // Check balance
        $year  = $startDate->year;
        $alloc = LeaveAllocation::where('user_id', $user->id)
            ->where('leave_type_id', $validated['leave_type_id'])
            ->where('year', $year)
            ->first();

        $leaveType = LeaveType::findOrFail($validated['leave_type_id']);
        $total     = $alloc ? $alloc->total_days : $leaveType->max_days_per_year;
        $used      = $alloc ? $alloc->used_days  : 0;
        $remaining = $total - $used;

        if ($totalDays > $remaining) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient leave balance. You have {$remaining} days remaining for {$leaveType->name} leave.",
            ], 422);
        }

        // Check overlapping leave
        $overlap = LeaveRequest::where('user_id', $user->id)
            ->whereIn('status', ['PENDING', 'APPROVED'])
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate, $endDate])
                  ->orWhereBetween('end_date', [$startDate, $endDate])
                  ->orWhere(fn($q2) => $q2->where('start_date', '<=', $startDate)->where('end_date', '>=', $endDate));
            })->exists();

        if ($overlap) {
            return response()->json([
                'success' => false,
                'message' => 'You already have a leave request for overlapping dates.',
            ], 422);
        }

        $leaveRequest = LeaveRequest::create([
            'tenant_id'     => $tenantId,
            'user_id'       => $user->id,
            'leave_type_id' => $validated['leave_type_id'],
            'start_date'    => $validated['start_date'],
            'end_date'      => $validated['end_date'],
            'total_days'    => $totalDays,
            'reason'        => $validated['reason'],
            'status'        => 'PENDING',
            'document_path' => $validated['document_path'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Leave request submitted for {$totalDays} day(s).",
            'data'    => $leaveRequest->load(['leaveType', 'user:id,name,email']),
        ], 201);
    }

    /** GET /api/leaves/{id} */
    public function show(int $id): JsonResponse
    {
        $leave = LeaveRequest::with(['user:id,name,avatar,employee_code', 'leaveType', 'approver:id,name'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $leave,
        ]);
    }

    /** PATCH /api/leaves/{id}/cancel — Employee cancels own request */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $leave = LeaveRequest::where('user_id', $request->user()->id)->findOrFail($id);

        if (! in_array($leave->status, ['PENDING'])) {
            return response()->json([
                'success' => false,
                'message' => 'Only pending leave requests can be cancelled.',
            ], 422);
        }

        $leave->update(['status' => 'CANCELLED']);

        return response()->json([
            'success' => true,
            'message' => 'Leave request cancelled.',
        ]);
    }

    /** PATCH /api/leaves/{id}/approve — HR/Manager approves */
    public function approve(Request $request, int $id): JsonResponse
    {
        $leave = LeaveRequest::findOrFail($id);

        if ($leave->status !== 'PENDING') {
            return response()->json([
                'success' => false,
                'message' => 'This request has already been ' . strtolower($leave->status) . '.',
            ], 422);
        }

        $leave->update([
            'status'      => 'APPROVED',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        // Deduct from leave balance
        $year  = Carbon::parse($leave->start_date)->year;
        LeaveAllocation::updateOrCreate(
            [
                'tenant_id'     => $leave->tenant_id,
                'user_id'       => $leave->user_id,
                'leave_type_id' => $leave->leave_type_id,
                'year'          => $year,
            ],
            ['total_days' => LeaveType::find($leave->leave_type_id)->max_days_per_year ?? 0]
        );

        LeaveAllocation::where([
            'user_id'       => $leave->user_id,
            'leave_type_id' => $leave->leave_type_id,
            'year'          => $year,
        ])->increment('used_days', $leave->total_days);

        // Mark attendance records as ON_LEAVE
        $period = CarbonPeriod::create($leave->start_date, $leave->end_date);
        foreach ($period as $date) {
            if (! $date->isWeekend()) {
                Attendance::updateOrCreate(
                    ['tenant_id' => $leave->tenant_id, 'user_id' => $leave->user_id, 'date' => $date->toDateString()],
                    ['status' => 'ON_LEAVE']
                );
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Leave request approved.',
            'data'    => $leave->fresh(['leaveType', 'user:id,name', 'approver:id,name']),
        ]);
    }

    /** PATCH /api/leaves/{id}/reject — HR/Manager rejects */
    public function reject(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $leave = LeaveRequest::findOrFail($id);

        if ($leave->status !== 'PENDING') {
            return response()->json([
                'success' => false,
                'message' => 'This request has already been ' . strtolower($leave->status) . '.',
            ], 422);
        }

        $leave->update([
            'status'           => 'REJECTED',
            'approved_by'      => $request->user()->id,
            'approved_at'      => now(),
            'rejection_reason' => $request->rejection_reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Leave request rejected.',
            'data'    => $leave->fresh(),
        ]);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // HOLIDAYS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /** GET /api/leaves/holidays */
    public function holidays(Request $request): JsonResponse
    {
        $year      = $request->year ?? now()->year;
        $holidays  = Holiday::whereYear('date', $year)->orderBy('date')->get();

        return response()->json([
            'success' => true,
            'data'    => $holidays,
        ]);
    }

    /** POST /api/leaves/holidays */
    public function createHoliday(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:191',
            'date'         => 'required|date',
            'type'         => 'nullable|in:NATIONAL,REGIONAL,OPTIONAL',
            'is_recurring' => 'nullable|boolean',
        ]);

        $holiday = Holiday::create([
            'tenant_id'    => $request->user()->tenant_id,
            'name'         => $validated['name'],
            'date'         => $validated['date'],
            'type'         => $validated['type'] ?? 'NATIONAL',
            'is_recurring' => $validated['is_recurring'] ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Holiday added.',
            'data'    => $holiday,
        ], 201);
    }

    /** DELETE /api/leaves/holidays/{id} */
    public function deleteHoliday(int $id): JsonResponse
    {
        $holiday = Holiday::findOrFail($id);
        $holiday->delete();

        return response()->json([
            'success' => true,
            'message' => 'Holiday removed.',
        ]);
    }
}
