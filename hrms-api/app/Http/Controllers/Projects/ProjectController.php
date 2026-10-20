<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Milestone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /** GET /api/projects */
    public function index(Request $request): JsonResponse
    {
        $query = Project::with([
            'client:id,company_name,contact_person,avatar',
            'manager:id,name,email,avatar',
            'members:id,name,email,avatar',
        ])->withCount(['tasks', 'milestones']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $projects = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data'    => $projects,
        ]);
    }

    /** POST /api/projects */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'code'             => 'nullable|string|max:30',
            'description'      => 'nullable|string',
            'client_id'        => 'nullable|exists:clients,id',
            'manager_id'       => 'nullable|exists:users,id',
            'status'           => 'nullable|in:PLANNING,ACTIVE,ON_HOLD,IN_REVIEW,COMPLETED',
            'priority'         => 'nullable|in:LOW,MEDIUM,HIGH,URGENT',
            'budget'           => 'nullable|numeric|min:0',
            'start_date'       => 'nullable|date',
            'target_end_date'  => 'nullable|date|after_or_equal:start_date',
            'repo_url'         => 'nullable|string|max:255',
            'color'            => 'nullable|string|max:10',
            'member_ids'       => 'nullable|array',
            'member_ids.*'     => 'exists:users,id',
        ]);

        $project = Project::create(array_merge($validated, [
            'tenant_id' => $request->user()->tenant_id,
        ]));

        if (!empty($validated['member_ids'])) {
            $membersData = [];
            foreach ($validated['member_ids'] as $userId) {
                $membersData[$userId] = [
                    'tenant_id' => $request->user()->tenant_id,
                    'role'      => 'MEMBER',
                ];
            }
            $project->members()->sync($membersData);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data'    => $project->load(['client', 'manager', 'members']),
        ], 201);
    }

    /** GET /api/projects/{id} */
    public function show(int $id): JsonResponse
    {
        $project = Project::with([
            'client',
            'manager:id,name,email,avatar,title',
            'members:id,name,email,avatar,title',
            'milestones',
            'tasks' => function ($q) {
                $q->with('assignee:id,name,avatar')->latest()->limit(50);
            },
            'requirements',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $project,
        ]);
    }

    /** PUT /api/projects/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'code'             => 'nullable|string|max:30',
            'description'      => 'nullable|string',
            'client_id'        => 'nullable|exists:clients,id',
            'manager_id'       => 'nullable|exists:users,id',
            'status'           => 'sometimes|in:PLANNING,ACTIVE,ON_HOLD,IN_REVIEW,COMPLETED',
            'priority'         => 'sometimes|in:LOW,MEDIUM,HIGH,URGENT',
            'budget'           => 'nullable|numeric|min:0',
            'spent'            => 'nullable|numeric|min:0',
            'progress_percent' => 'nullable|integer|between:0,100',
            'start_date'       => 'nullable|date',
            'target_end_date'  => 'nullable|date',
            'actual_end_date'  => 'nullable|date',
            'repo_url'         => 'nullable|string|max:255',
            'color'            => 'nullable|string|max:10',
            'member_ids'       => 'nullable|array',
            'member_ids.*'     => 'exists:users,id',
        ]);

        $project->update($validated);

        if (isset($validated['member_ids'])) {
            $membersData = [];
            foreach ($validated['member_ids'] as $userId) {
                $membersData[$userId] = [
                    'tenant_id' => $request->user()->tenant_id,
                    'role'      => 'MEMBER',
                ];
            }
            $project->members()->sync($membersData);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data'    => $project->fresh()->load(['client', 'manager', 'members']),
        ]);
    }

    /** DELETE /api/projects/{id} */
    public function destroy(int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
        ]);
    }

    // ── MILESTONES ────────────────────────────────────────────────────────────

    /** POST /api/projects/{id}/milestones */
    public function storeMilestone(Request $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'due_date'     => 'nullable|date',
            'is_completed' => 'nullable|boolean',
        ]);

        $milestone = Milestone::create(array_merge($validated, [
            'tenant_id'    => $request->user()->tenant_id,
            'project_id'   => $project->id,
            'completed_at' => (!empty($validated['is_completed'])) ? now() : null,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Milestone created.',
            'data'    => $milestone,
        ], 201);
    }

    /** PUT /api/projects/milestones/{milestoneId} */
    public function updateMilestone(Request $request, int $milestoneId): JsonResponse
    {
        $milestone = Milestone::findOrFail($milestoneId);

        $validated = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'description'  => 'nullable|string',
            'due_date'     => 'nullable|date',
            'is_completed' => 'sometimes|boolean',
        ]);

        if (isset($validated['is_completed'])) {
            $validated['completed_at'] = $validated['is_completed'] ? now() : null;
        }

        $milestone->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Milestone updated.',
            'data'    => $milestone,
        ]);
    }
}
