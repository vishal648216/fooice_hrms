<?php

namespace App\Http\Controllers\Clients;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /** GET /api/clients */
    public function index(Request $request): JsonResponse
    {
        $query = Client::withCount(['projects', 'invoices']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $clients = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $clients,
        ]);
    }

    /** POST /api/clients */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_name'   => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email'          => 'nullable|email|max:191',
            'phone'          => 'nullable|string|max:20',
            'address'        => 'nullable|string',
            'city'           => 'nullable|string|max:100',
            'country'        => 'nullable|string|max:100',
            'gst_number'     => 'nullable|string|max:30',
            'currency'       => 'nullable|string|size:3',
            'status'         => 'nullable|in:ACTIVE,LEAD,INACTIVE',
        ]);

        $client = Client::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Client created successfully.',
            'data'    => $client,
        ], 201);
    }

    /** GET /api/clients/{id} */
    public function show(int $id): JsonResponse
    {
        $client = Client::with([
            'projects' => function ($q) {
                $q->with('manager:id,name,avatar')->latest()->limit(10);
            },
            'invoices' => function ($q) {
                $q->latest()->limit(10);
            },
        ])->withCount(['projects', 'invoices'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $client,
        ]);
    }

    /** PUT /api/clients/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'company_name'   => 'sometimes|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email'          => 'nullable|email|max:191',
            'phone'          => 'nullable|string|max:20',
            'address'        => 'nullable|string',
            'city'           => 'nullable|string|max:100',
            'country'        => 'nullable|string|max:100',
            'gst_number'     => 'nullable|string|max:30',
            'currency'       => 'nullable|string|size:3',
            'status'         => 'sometimes|in:ACTIVE,LEAD,INACTIVE',
            'total_spent'    => 'nullable|numeric|min:0',
        ]);

        $client->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Client updated successfully.',
            'data'    => $client,
        ]);
    }

    /** DELETE /api/clients/{id} */
    public function destroy(int $id): JsonResponse
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client deleted successfully.',
        ]);
    }
}
