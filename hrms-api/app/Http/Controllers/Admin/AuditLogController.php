<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /** GET /api/audit-logs */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('user:id,name,avatar,email');

        if ($request->has('event')) {
            $query->where('event', $request->event);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $logs = $query->latest()->paginate($request->query('per_page', 25));

        return response()->json([
            'success' => true,
            'data'    => $logs,
        ]);
    }
}
