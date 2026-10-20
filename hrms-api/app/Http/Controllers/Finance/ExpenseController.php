<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /** GET /api/expenses */
    public function index(Request $request): JsonResponse
    {
        $query = Expense::with(['user:id,name,avatar,email', 'project:id,name', 'approver:id,name']);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Regular employees only see their own claims
        $user = $request->user();
        if ($user->role === 'EMPLOYEE') {
            $query->where('user_id', $user->id);
        }

        $expenses = $query->latest('expense_date')->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $expenses,
        ]);
    }

    /** POST /api/expenses */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'category'     => 'required|in:TRAVEL,MEALS,OFFICE,SOFTWARE,HARDWARE,OTHER',
            'amount'       => 'required|numeric|min:1',
            'currency'     => 'nullable|string|size:3',
            'expense_date' => 'required|date',
            'project_id'   => 'nullable|exists:projects,id',
            'receipt_path' => 'nullable|string',
        ]);

        $expense = Expense::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
            'user_id'   => $request->user()->id,
            'status'    => 'PENDING',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Expense submitted for approval.',
            'data'    => $expense->load('user:id,name,avatar'),
        ], 201);
    }

    /** PATCH /api/expenses/{id}/status */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $expense = Expense::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:PENDING,APPROVED,REJECTED,REIMBURSED',
        ]);

        $expense->update([
            'status'      => $validated['status'],
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Expense status updated.',
            'data'    => $expense->load('approver:id,name'),
        ]);
    }

    /** DELETE /api/expenses/{id} */
    public function destroy(int $id): JsonResponse
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted.',
        ]);
    }
}
