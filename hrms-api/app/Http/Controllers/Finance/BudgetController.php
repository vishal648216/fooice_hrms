<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    /** GET /api/budgets */
    public function index(Request $request): JsonResponse
    {
        $budgets = Budget::with(['project:id,name', 'department:id,name'])->get();

        return response()->json([
            'success' => true,
            'data'    => $budgets,
        ]);
    }

    /** POST /api/budgets */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'category'         => 'nullable|string',
            'project_id'       => 'nullable|exists:projects,id',
            'department_id'    => 'nullable|exists:departments,id',
            'allocated_amount' => 'required|numeric|min:0',
            'spent_amount'     => 'nullable|numeric|min:0',
            'period_start'     => 'required|date',
            'period_end'       => 'required|date|after_or_equal:period_start',
            'status'           => 'nullable|in:ACTIVE,CLOSED,OVERRUN',
        ]);

        $budget = Budget::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Budget allocated successfully.',
            'data'    => $budget,
        ], 201);
    }

    /** PUT /api/budgets/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $budget = Budget::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'allocated_amount' => 'sometimes|numeric|min:0',
            'spent_amount'     => 'nullable|numeric|min:0',
            'period_start'     => 'sometimes|date',
            'period_end'       => 'sometimes|date',
            'status'           => 'sometimes|in:ACTIVE,CLOSED,OVERRUN',
        ]);

        $budget->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Budget updated.',
            'data'    => $budget,
        ]);
    }

    /** DELETE /api/budgets/{id} */
    public function destroy(int $id): JsonResponse
    {
        $budget = Budget::findOrFail($id);
        $budget->delete();

        return response()->json([
            'success' => true,
            'message' => 'Budget deleted.',
        ]);
    }
}
