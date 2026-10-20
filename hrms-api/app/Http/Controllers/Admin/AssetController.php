<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    /** GET /api/assets */
    public function index(Request $request): JsonResponse
    {
        $query = Asset::with(['assignee:id,name,email,avatar']);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $assets = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $assets,
        ]);
    }

    /** POST /api/assets */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'asset_code'     => 'nullable|string|max:50',
            'category'       => 'required|in:LAPTOP,DESKTOP,PHONE,TABLET,VEHICLE,SOFTWARE,OTHER',
            'assigned_to'    => 'nullable|exists:users,id',
            'purchase_date'  => 'nullable|date',
            'purchase_price' => 'nullable|numeric|min:0',
            'status'         => 'nullable|in:AVAILABLE,ASSIGNED,MAINTENANCE,RETIRED',
            'notes'          => 'nullable|string',
        ]);

        $asset = Asset::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Asset registered.',
            'data'    => $asset->load('assignee:id,name,avatar'),
        ], 201);
    }

    /** PUT /api/assets/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $asset = Asset::findOrFail($id);

        $validated = $request->validate([
            'name'           => 'sometimes|string|max:255',
            'asset_code'     => 'nullable|string|max:50',
            'category'       => 'sometimes|in:LAPTOP,DESKTOP,PHONE,TABLET,VEHICLE,SOFTWARE,OTHER',
            'assigned_to'    => 'nullable|exists:users,id',
            'purchase_date'  => 'nullable|date',
            'purchase_price' => 'nullable|numeric|min:0',
            'status'         => 'sometimes|in:AVAILABLE,ASSIGNED,MAINTENANCE,RETIRED',
            'notes'          => 'nullable|string',
        ]);

        $asset->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Asset updated.',
            'data'    => $asset->load('assignee:id,name,avatar'),
        ]);
    }

    /** DELETE /api/assets/{id} */
    public function destroy(int $id): JsonResponse
    {
        $asset = Asset::findOrFail($id);
        $asset->delete();

        return response()->json([
            'success' => true,
            'message' => 'Asset deleted.',
        ]);
    }
}
