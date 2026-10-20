<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /** GET /api/departments */
    public function index(Request $request): JsonResponse
    {
        $departments = Department::with(['head:id,name,email,avatar', 'subDepartments', 'designations'])
            ->withCount('users')
            ->whereNull('parent_department_id')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $departments,
        ]);
    }

    /** GET /api/departments/all */
    public function allFlat(Request $request): JsonResponse
    {
        $departments = Department::with(['head:id,name,email,avatar'])->withCount('users')->get();

        return response()->json([
            'success' => true,
            'data'    => $departments,
        ]);
    }

    /** POST /api/departments */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                 => 'required|string|max:255',
            'code'                 => 'nullable|string|max:20',
            'description'          => 'nullable|string',
            'head_user_id'         => 'nullable|exists:users,id',
            'parent_department_id' => 'nullable|exists:departments,id',
            'color'                => 'nullable|string|max:10',
        ]);

        $department = Department::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Department created successfully.',
            'data'    => $department->load('head:id,name,email,avatar'),
        ], 201);
    }

    /** GET /api/departments/{id} */
    public function show(int $id): JsonResponse
    {
        $department = Department::with(['head', 'subDepartments', 'designations', 'users:id,name,email,avatar,title,role'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $department,
        ]);
    }

    /** PUT /api/departments/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'name'                 => 'sometimes|string|max:255',
            'code'                 => 'nullable|string|max:20',
            'description'          => 'nullable|string',
            'head_user_id'         => 'nullable|exists:users,id',
            'parent_department_id' => 'nullable|exists:departments,id',
            'color'                => 'nullable|string|max:10',
        ]);

        $department->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Department updated successfully.',
            'data'    => $department->fresh()->load('head:id,name,email,avatar'),
        ]);
    }

    /** DELETE /api/departments/{id} */
    public function destroy(int $id): JsonResponse
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully.',
        ]);
    }

    // ── DESIGNATIONS ──────────────────────────────────────────────────────────

    /** GET /api/departments/{id}/designations */
    public function listDesignations(int $id): JsonResponse
    {
        $designations = Designation::where('department_id', $id)->get();

        return response()->json([
            'success' => true,
            'data'    => $designations,
        ]);
    }

    /** POST /api/designations */
    public function storeDesignation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => 'nullable|exists:departments,id',
            'name'          => 'required|string|max:255',
            'level'         => 'nullable|integer|min:1',
        ]);

        $designation = Designation::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Designation created successfully.',
            'data'    => $designation,
        ], 201);
    }

    /** DELETE /api/designations/{id} */
    public function destroyDesignation(int $id): JsonResponse
    {
        $designation = Designation::findOrFail($id);
        $designation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Designation deleted successfully.',
        ]);
    }
}
