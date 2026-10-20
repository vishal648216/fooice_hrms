<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\WorkShift;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkShiftController extends Controller
{
    /** GET /api/shifts */
    public function index(Request $request): JsonResponse
    {
        $shifts = WorkShift::all();

        return response()->json([
            'success' => true,
            'data'    => $shifts,
        ]);
    }

    /** POST /api/shifts */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:100',
            'start_time'     => 'required|date_format:H:i',
            'end_time'       => 'required|date_format:H:i',
            'is_night_shift' => 'nullable|boolean',
            'break_minutes'  => 'nullable|integer|min:0',
            'working_days'   => 'nullable|array',
        ]);

        $shift = WorkShift::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Work shift created.',
            'data'    => $shift,
        ], 201);
    }

    /** PUT /api/shifts/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $shift = WorkShift::findOrFail($id);

        $validated = $request->validate([
            'name'           => 'sometimes|string|max:100',
            'start_time'     => 'sometimes|date_format:H:i',
            'end_time'       => 'sometimes|date_format:H:i',
            'is_night_shift' => 'nullable|boolean',
            'break_minutes'  => 'nullable|integer|min:0',
            'working_days'   => 'nullable|array',
        ]);

        $shift->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Work shift updated.',
            'data'    => $shift,
        ]);
    }

    /** DELETE /api/shifts/{id} */
    public function destroy(int $id): JsonResponse
    {
        $shift = WorkShift::findOrFail($id);
        $shift->delete();

        return response()->json([
            'success' => true,
            'message' => 'Work shift deleted.',
        ]);
    }
}
