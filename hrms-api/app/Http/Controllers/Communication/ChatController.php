<?php

namespace App\Http\Controllers\Communication;

use App\Http\Controllers\Controller;
use App\Models\ChatChannel;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /** GET /api/chat/channels */
    public function channels(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $channels = ChatChannel::with(['creator:id,name,avatar'])
            ->withCount('messages')
            ->where(function ($q) use ($userId) {
                $q->where('type', 'PUBLIC')
                  ->orWhereHas('members', function ($m) use ($userId) {
                      $m->where('users.id', $userId);
                  });
            })
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $channels,
        ]);
    }

    /** POST /api/chat/channels */
    public function createChannel(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'type'        => 'required|in:PUBLIC,PRIVATE,DIRECT,GROUP',
            'member_ids'  => 'nullable|array',
            'member_ids.*'=> 'exists:users,id',
        ]);

        $tenantId = $request->user()->tenant_id;
        $userId   = $request->user()->id;

        $channel = ChatChannel::create([
            'tenant_id'   => $tenantId,
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type'        => $validated['type'],
            'created_by'  => $userId,
        ]);

        // Add creator as Admin member
        $members = [$userId => ['tenant_id' => $tenantId, 'role' => 'ADMIN']];

        if (!empty($validated['member_ids'])) {
            foreach ($validated['member_ids'] as $mId) {
                if ($mId != $userId) {
                    $members[$mId] = ['tenant_id' => $tenantId, 'role' => 'MEMBER'];
                }
            }
        }

        $channel->members()->sync($members);

        return response()->json([
            'success' => true,
            'message' => 'Channel created successfully.',
            'data'    => $channel->load('members:id,name,avatar'),
        ], 201);
    }

    /** GET /api/chat/channels/{id}/messages */
    public function messages(Request $request, int $id): JsonResponse
    {
        $channel = ChatChannel::findOrFail($id);

        $messages = ChatMessage::where('chat_channel_id', $channel->id)
            ->whereNull('parent_message_id')
            ->with([
                'user:id,name,avatar,title',
                'replies.user:id,name,avatar',
            ])
            ->latest()
            ->paginate($request->query('per_page', 50));

        return response()->json([
            'success' => true,
            'data'    => $messages,
        ]);
    }

    /** POST /api/chat/channels/{id}/messages */
    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $channel = ChatChannel::findOrFail($id);

        $validated = $request->validate([
            'content'           => 'required_without:file_path|nullable|string',
            'type'              => 'nullable|in:TEXT,FILE,IMAGE,SYSTEM',
            'file_path'         => 'nullable|string',
            'file_name'         => 'nullable|string',
            'file_size'         => 'nullable|integer',
            'parent_message_id' => 'nullable|exists:chat_messages,id',
        ]);

        $message = ChatMessage::create([
            'tenant_id'         => $request->user()->tenant_id,
            'chat_channel_id'   => $channel->id,
            'user_id'           => $request->user()->id,
            'content'           => $validated['content'] ?? null,
            'type'              => $validated['type'] ?? 'TEXT',
            'file_path'         => $validated['file_path'] ?? null,
            'file_name'         => $validated['file_name'] ?? null,
            'file_size'         => $validated['file_size'] ?? null,
            'parent_message_id' => $validated['parent_message_id'] ?? null,
            'reactions'         => [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent.',
            'data'    => $message->load('user:id,name,avatar,title'),
        ], 201);
    }

    /** POST /api/chat/messages/{id}/react */
    public function react(Request $request, int $id): JsonResponse
    {
        $message = ChatMessage::findOrFail($id);

        $validated = $request->validate([
            'emoji' => 'required|string|max:10',
        ]);

        $emoji     = $validated['emoji'];
        $userId    = $request->user()->id;
        $reactions = $message->reactions ?? [];

        if (!isset($reactions[$emoji])) {
            $reactions[$emoji] = [];
        }

        if (in_array($userId, $reactions[$emoji])) {
            $reactions[$emoji] = array_values(array_diff($reactions[$emoji], [$userId]));
            if (empty($reactions[$emoji])) {
                unset($reactions[$emoji]);
            }
        } else {
            $reactions[$emoji][] = $userId;
        }

        $message->update(['reactions' => $reactions]);

        return response()->json([
            'success' => true,
            'data'    => $message,
        ]);
    }
}
