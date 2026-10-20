<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureModuleEnabled — Guards routes behind module access.
 *
 * Usage in routes:
 *   ->middleware('module:employees')
 *   ->middleware('module:projects,finance')  // any of these modules
 *
 * How it works:
 *   - Gets current tenant from authenticated user
 *   - Checks if the required module is enabled for that tenant
 *   - Returns 403 if disabled
 */
class EnsureModuleEnabled
{
    public function handle(Request $request, Closure $next, string ...$moduleKeys): Response
    {
        $user = $request->user();

        if (! $user || ! $user->tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
            ], 401);
        }

        $tenant = $user->tenant->load('modules');

        // Check if ANY of the required modules is enabled
        foreach ($moduleKeys as $key) {
            if ($tenant->isModuleEnabled($key)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'This feature is not available in your current plan. Please upgrade to access it.',
            'modules' => $moduleKeys,
        ], 403);
    }
}
