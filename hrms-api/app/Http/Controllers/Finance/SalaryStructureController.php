<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\SalaryStructure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalaryStructureController extends Controller
{
    /** GET /api/finance/salary-structures */
    public function index(Request $request): JsonResponse
    {
        $structures = SalaryStructure::all();

        return response()->json([
            'success' => true,
            'data'    => $structures,
        ]);
    }

    /** POST /api/finance/salary-structures */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:255',
            'description'           => 'nullable|string',
            'basic_percent'         => 'required|numeric|min:0|max:100',
            'hra_percent'           => 'required|numeric|min:0|max:100',
            'special_allowance'     => 'required|numeric|min:0|max:100',
            'pf_employee_percent'   => 'nullable|numeric|min:0|max:100',
            'pf_employer_percent'   => 'nullable|numeric|min:0|max:100',
            'esic_employee_percent' => 'nullable|numeric|min:0|max:100',
            'esic_employer_percent' => 'nullable|numeric|min:0|max:100',
            'professional_tax'      => 'nullable|numeric|min:0',
        ]);

        $structure = SalaryStructure::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Salary structure template created.',
            'data'    => $structure,
        ], 201);
    }

    /** PUT /api/finance/salary-structures/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $structure = SalaryStructure::findOrFail($id);

        $validated = $request->validate([
            'name'                  => 'sometimes|string|max:255',
            'description'           => 'nullable|string',
            'basic_percent'         => 'sometimes|numeric|min:0|max:100',
            'hra_percent'           => 'sometimes|numeric|min:0|max:100',
            'special_allowance'     => 'sometimes|numeric|min:0|max:100',
            'pf_employee_percent'   => 'nullable|numeric|min:0|max:100',
            'pf_employer_percent'   => 'nullable|numeric|min:0|max:100',
            'esic_employee_percent' => 'nullable|numeric|min:0|max:100',
            'esic_employer_percent' => 'nullable|numeric|min:0|max:100',
            'professional_tax'      => 'nullable|numeric|min:0',
        ]);

        $structure->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Salary structure updated.',
            'data'    => $structure,
        ]);
    }

    /** DELETE /api/finance/salary-structures/{id} */
    public function destroy(int $id): JsonResponse
    {
        $structure = SalaryStructure::findOrFail($id);
        $structure->delete();

        return response()->json([
            'success' => true,
            'message' => 'Salary structure deleted.',
        ]);
    }
}
