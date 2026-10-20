<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\PayrollRecord;
use App\Models\User;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    /** GET /api/payroll */
    public function index(Request $request): JsonResponse
    {
        $month = $request->query('month', now()->month);
        $year  = $request->query('year', now()->year);

        $query = PayrollRecord::with([
            'user:id,name,email,avatar,employee_code,title,department_id',
            'user.department:id,name',
        ])
        ->where('month', $month)
        ->where('year', $year);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $records = $query->get();

        $summary = [
            'total_gross' => (float) $records->sum('gross_salary'),
            'total_net'   => (float) $records->sum('net_salary'),
            'total_pf'    => (float) $records->sum('pf_deduction'),
            'total_tds'   => (float) $records->sum('tds_deduction'),
            'total_count' => $records->count(),
            'paid_count'  => $records->where('status', 'PAID')->count(),
        ];

        return response()->json([
            'success' => true,
            'summary' => $summary,
            'data'    => $records,
        ]);
    }

    /** POST /api/payroll/generate — Auto-generate monthly payroll for all active employees */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => 'required|integer|between:1,12',
            'year'  => 'required|integer|min:2020|max:2050',
        ]);

        $tenantId = $request->user()->tenant_id;
        $month    = $validated['month'];
        $year     = $validated['year'];

        $employees = User::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->whereIn('role', ['EMPLOYEE', 'MANAGER', 'HR'])
            ->with('employeeProfile')
            ->get();

        $generated = 0;
        $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;

        foreach ($employees as $employee) {
            $profile = $employee->employeeProfile;
            $baseSalary = $profile ? (float) $profile->base_salary : 30000.00;

            if ($baseSalary <= 0) {
                $baseSalary = 30000.00;
            }

            // Attendance calculation for the month
            $attendances = Attendance::where('user_id', $employee->id)
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->get();

            $presentDays = $attendances->whereIn('status', ['ON_TIME', 'LATE', 'REMOTE'])->count();
            $onLeaveDays = $attendances->where('status', 'ON_LEAVE')->count();
            $paidDays    = min($daysInMonth, $presentDays + $onLeaveDays + 8); // approximate with weekends
            $lopDays     = max(0, $daysInMonth - $paidDays);

            // Calculation based on standard Indian salary breakdown:
            // Basic: 50%, HRA: 20%, Special: 30%
            $basicSalary      = round($baseSalary * 0.50, 2);
            $hra              = round($baseSalary * 0.20, 2);
            $specialAllowance = round($baseSalary * 0.30, 2);
            $grossSalary      = $baseSalary;

            // Deductions
            $pfDeduction      = round($basicSalary * 0.12, 2); // PF 12% of basic
            $esicDeduction    = ($baseSalary <= 21000) ? round($grossSalary * 0.0075, 2) : 0;
            $tdsDeduction     = ($baseSalary > 50000) ? round($grossSalary * 0.05, 2) : 0;
            $otherDeductions  = 200.00; // Professional Tax
            $totalDeductions  = $pfDeduction + $esicDeduction + $tdsDeduction + $otherDeductions;

            $netSalary = round(max(0, $grossSalary - $totalDeductions), 2);

            PayrollRecord::updateOrCreate(
                [
                    'tenant_id' => $tenantId,
                    'user_id'   => $employee->id,
                    'month'     => $month,
                    'year'      => $year,
                ],
                [
                    'basic_salary'      => $basicSalary,
                    'hra'               => $hra,
                    'special_allowance' => $specialAllowance,
                    'other_earnings'    => 0,
                    'gross_salary'      => $grossSalary,
                    'pf_deduction'      => $pfDeduction,
                    'esic_deduction'    => $esicDeduction,
                    'tds_deduction'     => $tdsDeduction,
                    'other_deductions'  => $otherDeductions,
                    'net_salary'        => $netSalary,
                    'paid_days'         => $paidDays,
                    'loss_of_pay_days'  => $lopDays,
                    'status'            => 'DRAFT',
                    'generated_by'      => $request->user()->id,
                ]
            );

            $generated++;
        }

        return response()->json([
            'success' => true,
            'message' => "Successfully generated payroll records for {$generated} employees for {$month}/{$year}.",
        ]);
    }

    /** GET /api/payroll/{id} */
    public function show(int $id): JsonResponse
    {
        $record = PayrollRecord::with([
            'user:id,name,email,avatar,employee_code,title,department_id,phone,address',
            'user.department:id,name',
            'user.employeeProfile',
            'generator:id,name',
            'approver:id,name',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $record,
        ]);
    }

    /** PATCH /api/payroll/{id}/status */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $record = PayrollRecord::findOrFail($id);

        $validated = $request->validate([
            'status'          => 'required|in:DRAFT,PROCESSED,PAID',
            'payment_mode'    => 'nullable|string',
            'transaction_ref' => 'nullable|string',
        ]);

        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'PAID') {
            $updateData['payment_date']    = now();
            $updateData['payment_mode']    = $validated['payment_mode'] ?? 'BANK_TRANSFER';
            $updateData['transaction_ref'] = $validated['transaction_ref'] ?? ('TXN-' . strtoupper(uniqid()));
            $updateData['approved_by']     = $request->user()->id;
        }

        $record->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Payroll record updated.',
            'data'    => $record,
        ]);
    }
}
