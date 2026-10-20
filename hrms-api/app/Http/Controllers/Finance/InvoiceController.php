<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /** GET /api/invoices */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['client:id,company_name,email,avatar', 'project:id,name,code']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $invoices = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $invoices,
        ]);
    }

    /** POST /api/invoices */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id'       => 'required|exists:clients,id',
            'project_id'      => 'nullable|exists:projects,id',
            'issue_date'      => 'required|date',
            'due_date'        => 'required|date|after_or_equal:issue_date',
            'currency'        => 'nullable|string|size:3',
            'tax_percent'     => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes'           => 'nullable|string',
            'terms'           => 'nullable|string',
            'items'           => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity'    => 'required|numeric|min:0.01',
            'items.*.unit_price'  => 'required|numeric|min:0',
        ]);

        $tenantId = $request->user()->tenant_id;
        $year     = date('Y');
        $count    = Invoice::where('tenant_id', $tenantId)->count() + 1;
        $invNum   = 'INV-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

        // Calculate subtotal
        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $subtotal += ($item['quantity'] * $item['unit_price']);
        }

        $taxPercent     = $validated['tax_percent'] ?? 18.00;
        $discountAmount = $validated['discount_amount'] ?? 0;
        $taxAmount      = round(($subtotal - $discountAmount) * ($taxPercent / 100), 2);
        $totalAmount    = round($subtotal - $discountAmount + $taxAmount, 2);

        $invoice = Invoice::create([
            'tenant_id'       => $tenantId,
            'invoice_number'  => $invNum,
            'client_id'       => $validated['client_id'],
            'project_id'      => $validated['project_id'] ?? null,
            'issue_date'      => $validated['issue_date'],
            'due_date'        => $validated['due_date'],
            'currency'        => $validated['currency'] ?? 'INR',
            'subtotal'        => $subtotal,
            'tax_percent'     => $taxPercent,
            'tax_amount'      => $taxAmount,
            'discount_amount' => $discountAmount,
            'total_amount'    => $totalAmount,
            'status'          => 'DRAFT',
            'notes'           => $validated['notes'] ?? null,
            'terms'           => $validated['terms'] ?? null,
            'created_by'      => $request->user()->id,
        ]);

        foreach ($validated['items'] as $item) {
            InvoiceItem::create([
                'tenant_id'   => $tenantId,
                'invoice_id'  => $invoice->id,
                'description' => $item['description'],
                'quantity'    => $item['quantity'],
                'unit_price'  => $item['unit_price'],
                'total'       => round($item['quantity'] * $item['unit_price'], 2),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Invoice created successfully.',
            'data'    => $invoice->load(['client', 'project', 'items']),
        ], 201);
    }

    /** GET /api/invoices/{id} */
    public function show(int $id): JsonResponse
    {
        $invoice = Invoice::with(['client', 'project', 'items', 'creator:id,name'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $invoice,
        ]);
    }

    /** PATCH /api/invoices/{id}/status */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $invoice = Invoice::findOrFail($id);

        $validated = $request->validate([
            'status'       => 'required|in:DRAFT,SENT,PAID,OVERDUE,CANCELLED',
            'payment_mode' => 'nullable|string',
        ]);

        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'PAID') {
            $updateData['payment_date'] = now();
            $updateData['payment_mode'] = $validated['payment_mode'] ?? 'BANK_TRANSFER';
        }

        $invoice->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Invoice status updated.',
            'data'    => $invoice,
        ]);
    }

    /** DELETE /api/invoices/{id} */
    public function destroy(int $id): JsonResponse
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Invoice deleted successfully.',
        ]);
    }
}
