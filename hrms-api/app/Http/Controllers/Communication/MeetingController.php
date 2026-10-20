<?php

namespace App\Http\Controllers\Communication;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    /** GET /api/meetings */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $meetings = Meeting::with([
            'organizer:id,name,email,avatar',
            'project:id,name',
            'participants:id,name,avatar',
        ])
        ->where(function ($q) use ($userId) {
            $q->where('organizer_id', $userId)
              ->orWhereHas('participants', function ($p) use ($userId) {
                  $p->where('users.id', $userId);
              });
        })
        ->orderBy('start_time', 'asc')
        ->get();

        return response()->json([
            'success' => true,
            'data'    => $meetings,
        ]);
    }

    /** POST /api/meetings */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'project_id'      => 'nullable|exists:projects,id',
            'start_time'      => 'required|date',
            'end_time'        => 'required|date|after:start_time',
            'meet_url'        => 'nullable|url',
            'is_recurring'    => 'nullable|boolean',
            'participant_ids' => 'nullable|array',
            'participant_ids.*' => 'exists:users,id',
        ]);

        $tenantId = $request->user()->tenant_id;
        $userId   = $request->user()->id;

        $meeting = Meeting::create([
            'tenant_id'    => $tenantId,
            'title'        => $validated['title'],
            'description'  => $validated['description'] ?? null,
            'project_id'   => $validated['project_id'] ?? null,
            'organizer_id' => $userId,
            'status'       => 'SCHEDULED',
            'start_time'   => $validated['start_time'],
            'end_time'     => $validated['end_time'],
            'meet_url'     => $validated['meet_url'] ?? ('https://meet.google.com/' . strtolower(substr(md5(uniqid()), 0, 3) . '-' . substr(md5(uniqid()), 3, 4) . '-' . substr(md5(uniqid()), 7, 3))),
            'is_recurring' => $validated['is_recurring'] ?? false,
        ]);

        // Add participants
        $participants = [$userId => ['tenant_id' => $tenantId, 'status' => 'ACCEPTED']];

        if (!empty($validated['participant_ids'])) {
            foreach ($validated['participant_ids'] as $pId) {
                if ($pId != $userId) {
                    $participants[$pId] = ['tenant_id' => $tenantId, 'status' => 'INVITED'];
                }
            }
        }

        $meeting->participants()->sync($participants);

        return response()->json([
            'success' => true,
            'message' => 'Meeting scheduled successfully.',
            'data'    => $meeting->load(['organizer', 'participants']),
        ], 201);
    }

    /** PATCH /api/meetings/{id}/status */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:SCHEDULED,IN_PROGRESS,COMPLETED,CANCELLED',
        ]);

        $meeting->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Meeting status updated.',
            'data'    => $meeting,
        ]);
    }

    /** PUT /api/meetings/{id}/ai-notes */
    public function updateAiNotes(Request $request, int $id): JsonResponse
    {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'ai_notes' => 'required|string',
        ]);

        $meeting->update([
            'has_ai_notes' => true,
            'ai_notes'     => $validated['ai_notes'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'AI meeting notes saved.',
            'data'    => $meeting,
        ]);
    }

    /** DELETE /api/meetings/{id} */
    public function destroy(int $id): JsonResponse
    {
        $meeting = Meeting::findOrFail($id);
        $meeting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Meeting deleted.',
        ]);
    }
}
