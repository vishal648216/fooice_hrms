<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureTenantActive — Blocks requests if the tenant is suspended/expired.
 * Runs on ALL authenticated tenant API routes.
 */
class EnsureTenantActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->tenant_id) {
            return $next($request);
        }

        $tenant = $user->tenant;

        if (! $tenant || ! $tenant->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Your subscription is currently ' . ($tenant->status ?? 'inactive') . '. Please contact support.',
                'status'  => $tenant->status ?? 'INACTIVE',
            ], 403);
        }

        return $next($request);
    }
}
