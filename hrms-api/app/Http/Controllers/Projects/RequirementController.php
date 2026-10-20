<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RequirementController extends Controller
{
    /** GET /api/projects/{projectId}/requirements */
    public function index(Request $request, int $projectId): JsonResponse
    {
        $requirements = Requirement::where('project_id', $projectId)
            ->with(['author:id,name,avatar', 'reviewer:id,name,avatar'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $requirements,
        ]);
    }

    /** POST /api/projects/{projectId}/requirements */
    public function store(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:DRAFT,REVIEWED,APPROVED,CHANGES_REQUESTED',
        ]);

        $requirement = Requirement::create([
            'tenant_id'   => $request->user()->tenant_id,
            'project_id'  => $project->id,
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status'      => $validated['status'] ?? 'DRAFT',
            'created_by'  => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Requirement created.',
            'data'    => $requirement->load('author:id,name,avatar'),
        ], 201);
    }

    /** PUT /api/projects/requirements/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $requirement = Requirement::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:DRAFT,REVIEWED,APPROVED,CHANGES_REQUESTED',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'APPROVED') {
            $validated['reviewed_by'] = $request->user()->id;
        }

        $requirement->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Requirement updated.',
            'data'    => $requirement->load(['author', 'reviewer']),
        ]);
    }

    /** DELETE /api/projects/requirements/{id} */
    public function destroy(int $id): JsonResponse
    {
        $requirement = Requirement::findOrFail($id);
        $requirement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Requirement deleted.',
        ]);
    }
}
