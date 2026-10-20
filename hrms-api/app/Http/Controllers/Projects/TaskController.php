<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\TaskTimeLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /** GET /api/tasks */
    public function index(Request $request): JsonResponse
    {
        $query = Task::with([
            'project:id,name,code,color',
            'assignee:id,name,avatar,email',
            'reporter:id,name,avatar',
        ])->withCount(['subtasks', 'comments']);

        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('assignee_id')) {
            $query->where('assignee_id', $request->assignee_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('parent_task_id')) {
            $query->where('parent_task_id', $request->parent_task_id);
        } else {
            // By default, top-level tasks
            if (!$request->has('all_levels')) {
                $query->whereNull('parent_task_id');
            }
        }

        $tasks = $query->orderBy('order_index', 'asc')->get();

        return response()->json([
            'success' => true,
            'data'    => $tasks,
        ]);
    }

    /** POST /api/tasks */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id'      => 'required|exists:projects,id',
            'parent_task_id'  => 'nullable|exists:tasks,id',
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'code'            => 'nullable|string|max:30',
            'assignee_id'     => 'nullable|exists:users,id',
            'status'          => 'nullable|in:BACKLOG,TODO,IN_PROGRESS,IN_REVIEW,CLIENT_APPROVAL,DONE',
            'priority'        => 'nullable|in:LOW,MEDIUM,HIGH,URGENT',
            'due_date'        => 'nullable|date',
            'estimated_hours' => 'nullable|numeric|min:0',
            'labels'          => 'nullable|array',
        ]);

        $maxOrder = Task::where('project_id', $validated['project_id'])
            ->where('status', $validated['status'] ?? 'TODO')
            ->max('order_index') ?? 0;

        $task = Task::create(array_merge($validated, [
            'tenant_id'   => $request->user()->tenant_id,
            'reporter_id' => $request->user()->id,
            'order_index' => $maxOrder + 1,
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data'    => $task->load(['project', 'assignee', 'reporter']),
        ], 201);
    }

    /** GET /api/tasks/{id} */
    public function show(int $id): JsonResponse
    {
        $task = Task::with([
            'project',
            'assignee:id,name,email,avatar,title',
            'reporter:id,name,email,avatar',
            'subtasks.assignee:id,name,avatar',
            'comments.user:id,name,avatar',
            'timeLogs.user:id,name,avatar',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $task,
        ]);
    }

    /** PUT /api/tasks/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'assignee_id'     => 'nullable|exists:users,id',
            'status'          => 'sometimes|in:BACKLOG,TODO,IN_PROGRESS,IN_REVIEW,CLIENT_APPROVAL,DONE',
            'priority'        => 'sometimes|in:LOW,MEDIUM,HIGH,URGENT',
            'due_date'        => 'nullable|date',
            'estimated_hours' => 'nullable|numeric|min:0',
            'logged_hours'    => 'nullable|numeric|min:0',
            'order_index'     => 'nullable|integer',
            'labels'          => 'nullable|array',
        ]);

        $task->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data'    => $task->fresh()->load(['project', 'assignee']),
        ]);
    }

    /** PATCH /api/tasks/{id}/status */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'status'      => 'required|in:BACKLOG,TODO,IN_PROGRESS,IN_REVIEW,CLIENT_APPROVAL,DONE',
            'order_index' => 'nullable|integer',
        ]);

        $task->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Task status updated.',
            'data'    => $task,
        ]);
    }

    /** DELETE /api/tasks/{id} */
    public function destroy(int $id): JsonResponse
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully.',
        ]);
    }

    // ── TASK COMMENTS ─────────────────────────────────────────────────────────

    /** POST /api/tasks/{id}/comments */
    public function storeComment(Request $request, int $id): JsonResponse
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'content'  => 'required|string',
            'mentions' => 'nullable|array',
        ]);

        $comment = TaskComment::create([
            'tenant_id' => $request->user()->tenant_id,
            'task_id'   => $task->id,
            'user_id'   => $request->user()->id,
            'content'   => $validated['content'],
            'mentions'  => $validated['mentions'] ?? [],
        ]);

        $task->increment('comments_count');

        return response()->json([
            'success' => true,
            'message' => 'Comment posted.',
            'data'    => $comment->load('user:id,name,avatar'),
        ], 201);
    }

    // ── TASK TIME LOGS ────────────────────────────────────────────────────────

    /** POST /api/tasks/{id}/time-logs */
    public function storeTimeLog(Request $request, int $id): JsonResponse
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'logged_hours' => 'required|numeric|min:0.1|max:24',
            'description'  => 'nullable|string',
            'logged_date'  => 'required|date',
        ]);

        $timeLog = TaskTimeLog::create([
            'tenant_id'    => $request->user()->tenant_id,
            'task_id'      => $task->id,
            'user_id'      => $request->user()->id,
            'logged_hours' => $validated['logged_hours'],
            'description'  => $validated['description'] ?? null,
            'logged_date'  => $validated['logged_date'],
        ]);

        $task->increment('logged_hours', $validated['logged_hours']);

        return response()->json([
            'success' => true,
            'message' => 'Time logged successfully.',
            'data'    => $timeLog->load('user:id,name,avatar'),
        ], 201);
    }
}
