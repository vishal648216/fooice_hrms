<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmployeeProfile;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Employee Management Controller
 * All routes scoped to current tenant (via TenantScope)
 * Routes: /api/employees/*
 */
class EmployeeController extends Controller
{
    /** GET /api/employees */
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['department', 'designation', 'employeeProfile'])
            ->select('users.*');

        // Filters
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('employee_code', 'like', "%{$s}%");
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $employees = $query->orderBy('name')
                           ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data'    => $employees,
        ]);
    }

    /** POST /api/employees */
    public function store(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;

        $validated = $request->validate([
            'name'          => 'required|string|max:191',
            'email'         => 'required|email|max:191',
            'password'      => 'required|string|min:8',
            'phone'         => 'nullable|string|max:20',
            'employee_code' => 'nullable|string|max:50',
            'title'         => 'nullable|string|max:191',
            'role'          => 'required|in:SUPER_ADMIN,MANAGER,HR,EMPLOYEE,CLIENT',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id'=> 'nullable|exists:designations,id',
            'joining_date'  => 'nullable|date',
            'date_of_birth' => 'nullable|date',
            'gender'        => 'nullable|in:MALE,FEMALE,OTHER',
            'address'       => 'nullable|string',
            'hourly_rate'   => 'nullable|numeric|min:0',
            // Profile
            'employment_type' => 'nullable|in:FULL_TIME,PART_TIME,CONTRACT,INTERN',
            'salary_type'     => 'nullable|in:MONTHLY,HOURLY,DAILY',
            'base_salary'     => 'nullable|numeric|min:0',
        ]);

        // Check email uniqueness within tenant
        if (User::where('email', $validated['email'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'An employee with this email already exists.',
            ], 422);
        }

        // Auto-generate employee code if not given
        if (empty($validated['employee_code'])) {
            $count = User::count() + 1;
            $validated['employee_code'] = 'EMP-' . str_pad($count, 4, '0', STR_PAD_LEFT);
        }

        $user = User::create([
            'tenant_id'     => $tenantId,
            'name'          => $validated['name'],
            'email'         => $validated['email'],
            'password'      => Hash::make($validated['password']),
            'phone'         => $validated['phone'] ?? null,
            'employee_code' => $validated['employee_code'],
            'title'         => $validated['title'] ?? null,
            'role'          => $validated['role'],
            'department_id' => $validated['department_id'] ?? null,
            'designation_id'=> $validated['designation_id'] ?? null,
            'joining_date'  => $validated['joining_date'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'gender'        => $validated['gender'] ?? null,
            'address'       => $validated['address'] ?? null,
            'hourly_rate'   => $validated['hourly_rate'] ?? null,
        ]);

        // Create employee profile
        EmployeeProfile::create([
            'user_id'         => $user->id,
            'tenant_id'       => $tenantId,
            'employment_type' => $validated['employment_type'] ?? 'FULL_TIME',
            'salary_type'     => $validated['salary_type'] ?? 'MONTHLY',
            'base_salary'     => $validated['base_salary'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully.',
            'data'    => $user->load(['department', 'designation', 'employeeProfile']),
        ], 201);
    }

    /** GET /api/employees/{id} */
    public function show(int $id): JsonResponse
    {
        $user = User::with([
            'department', 'designation', 'employeeProfile',
            'attendances' => fn($q) => $q->latest()->limit(10),
            'leaveRequests' => fn($q) => $q->latest()->limit(5),
            'tasks' => fn($q) => $q->where('status', '!=', 'DONE')->limit(5),
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $user,
        ]);
    }

    /** PUT /api/employees/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'sometimes|string|max:191',
            'phone'         => 'nullable|string|max:20',
            'employee_code' => 'nullable|string|max:50',
            'title'         => 'nullable|string|max:191',
            'role'          => 'sometimes|in:SUPER_ADMIN,MANAGER,HR,EMPLOYEE,CLIENT',
            'department_id' => 'nullable|exists:departments,id',
            'designation_id'=> 'nullable|exists:designations,id',
            'joining_date'  => 'nullable|date',
            'date_of_birth' => 'nullable|date',
            'gender'        => 'nullable|in:MALE,FEMALE,OTHER',
            'address'       => 'nullable|string',
            'hourly_rate'   => 'nullable|numeric|min:0',
            'is_active'     => 'sometimes|boolean',
        ]);

        $user->update($validated);

        // Update profile if sent
        if ($request->has('employment_type') || $request->has('base_salary')) {
            $user->employeeProfile?->update(
                $request->only(['employment_type', 'salary_type', 'base_salary'])
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully.',
            'data'    => $user->fresh(['department', 'designation', 'employeeProfile']),
        ]);
    }

    /** DELETE /api/employees/{id} */
    public function destroy(int $id, Request $request): JsonResponse
    {
        // Cannot delete yourself
        if ($request->user()->id === $id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.',
            ], 403);
        }

        $user = User::findOrFail($id);
        $name = $user->name;
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => "{$name} has been removed.",
        ]);
    }

    /** GET /api/employees/departments */
    public function departments(): JsonResponse
    {
        $departments = Department::withCount('users')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $departments,
        ]);
    }

    /** PATCH /api/employees/{id}/status */
    public function toggleStatus(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => ! $user->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Employee status updated.',
            'data'    => ['id' => $user->id, 'is_active' => $user->is_active],
        ]);
    }
}
