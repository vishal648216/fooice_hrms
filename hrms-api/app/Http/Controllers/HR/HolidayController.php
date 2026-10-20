<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    /** GET /api/holidays */
    public function index(Request $request): JsonResponse
    {
        $year = $request->query('year', now()->year);

        $holidays = Holiday::whereYear('date', $year)
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $holidays,
        ]);
    }

    /** POST /api/holidays */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'date'         => 'required|date',
            'type'         => 'required|in:NATIONAL,REGIONAL,OPTIONAL',
            'is_recurring' => 'nullable|boolean',
        ]);

        $holiday = Holiday::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Holiday added.',
            'data'    => $holiday,
        ], 201);
    }

    /** PUT /api/holidays/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $holiday = Holiday::findOrFail($id);

        $validated = $request->validate([
            'name'         => 'sometimes|string|max:255',
            'date'         => 'sometimes|date',
            'type'         => 'sometimes|in:NATIONAL,REGIONAL,OPTIONAL',
            'is_recurring' => 'nullable|boolean',
        ]);

        $holiday->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Holiday updated.',
            'data'    => $holiday,
        ]);
    }

    /** DELETE /api/holidays/{id} */
    public function destroy(int $id): JsonResponse
    {
        $holiday = Holiday::findOrFail($id);
        $holiday->delete();

        return response()->json([
            'success' => true,
            'message' => 'Holiday deleted.',
        ]);
    }
}
