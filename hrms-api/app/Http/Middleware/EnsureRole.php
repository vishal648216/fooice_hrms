<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureRole — Guards routes by user role within the tenant.
 *
 * Usage in routes:
 *   ->middleware('role:SUPER_ADMIN,HR')
 *   ->middleware('role:SUPER_ADMIN,MANAGER')
 */
class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Super Admin has universal access within their tenant
        if ($user->role === 'SUPER_ADMIN') {
            return $next($request);
        }

        // Check if user has ANY of the permitted roles
        if (in_array($user->role, $roles)) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => "Access denied. This resource requires one of the following roles: " . implode(', ', $roles) . ". Your current role is: {$user->role}.",
            'required_roles' => $roles,
            'current_role'   => $user->role,
        ], 403);
    }
}
