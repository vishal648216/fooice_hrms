<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantModule;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Platform Tenant Management Controller
 * All routes protected by platform_admin guard.
 * Routes: /api/platform/tenants/*
 */
class TenantController extends Controller
{
    protected array $allModuleKeys = [
        'dashboard', 'employees', 'attendance', 'leave', 'payroll',
        'projects', 'tasks', 'chat', 'meetings', 'whiteboard',
        'clients', 'finance', 'files', 'ai', 'analytics',
    ];

    /** GET /api/platform/tenants */
    public function index(Request $request): JsonResponse
    {
        $query = Tenant::withCount('users')
            ->with(['modules', 'owner']);

        // Filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('owner_email', 'like', "%{$search}%")
                  ->orWhere('owner_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('plan')) {
            $query->where('plan', strtoupper($request->plan));
        }

        if ($request->filled('status')) {
            $query->where('status', strtoupper($request->status));
        }

        $tenants = $query->orderBy('created_at', 'desc')
                         ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data'    => $tenants,
        ]);
    }

    /** POST /api/platform/tenants */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_name'   => 'required|string|max:191',
            'owner_name'     => 'required|string|max:191',
            'owner_email'    => 'required|email|max:191',
            'owner_phone'    => 'nullable|string|max:20',
            'industry'       => 'nullable|string|max:100',
            'location'       => 'nullable|string|max:191',
            'plan'           => 'required|in:FREE,STARTER,PRO,ENTERPRISE',
            'status'         => 'nullable|in:ACTIVE,TRIAL,SUSPENDED,EXPIRED,CANCELLED',
            'modules'        => 'nullable|array',
        ]);

        // Generate unique slug
        $slug = Str::slug($validated['company_name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Tenant::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        // Plan limits
        $planLimits = [
            'FREE'       => ['employees' => 10,  'storage' => 5],
            'STARTER'    => ['employees' => 50,  'storage' => 20],
            'PRO'        => ['employees' => 200, 'storage' => 100],
            'ENTERPRISE' => ['employees' => 999, 'storage' => 500],
        ];
        $limits = $planLimits[$validated['plan']];

        $tenant = Tenant::create([
            'company_name'       => $validated['company_name'],
            'slug'               => $slug,
            'owner_name'         => $validated['owner_name'],
            'owner_email'        => $validated['owner_email'],
            'owner_phone'        => $validated['owner_phone'] ?? null,
            'industry'           => $validated['industry'] ?? null,
            'location'           => $validated['location'] ?? null,
            'plan'               => $validated['plan'],
            'status'             => $validated['status'] ?? 'TRIAL',
            'employee_count_limit' => $limits['employees'],
            'storage_cap_gb'     => $limits['storage'],
            'joined_date'        => now()->toDateString(),
            'trial_ends_at'      => $validated['status'] === 'TRIAL' ? now()->addDays(14) : null,
        ]);

        // Create default module entries (all enabled unless specified)
        $modulesConfig = $validated['modules'] ?? [];
        foreach ($this->allModuleKeys as $key) {
            TenantModule::create([
                'tenant_id'  => $tenant->id,
                'module_key' => $key,
                'is_enabled' => $modulesConfig[$key] ?? true,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Tenant '{$tenant->company_name}' registered successfully.",
            'data'    => $tenant->load('modules'),
        ], 201);
    }

    /** GET /api/platform/tenants/{id} */
    public function show(int $id): JsonResponse
    {
        $tenant = Tenant::with(['modules', 'owner', 'billingHistory'])
            ->withCount('users')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $tenant,
        ]);
    }

    /** PUT /api/platform/tenants/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);

        $validated = $request->validate([
            'company_name' => 'sometimes|string|max:191',
            'owner_name'   => 'sometimes|string|max:191',
            'owner_email'  => 'sometimes|email|max:191',
            'owner_phone'  => 'nullable|string|max:20',
            'industry'     => 'nullable|string|max:100',
            'location'     => 'nullable|string|max:191',
        ]);

        $tenant->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tenant updated successfully.',
            'data'    => $tenant->fresh('modules'),
        ]);
    }

    /** DELETE /api/platform/tenants/{id} */
    public function destroy(int $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);
        $name = $tenant->company_name;
        $tenant->delete(); // Soft delete

        return response()->json([
            'success' => true,
            'message' => "Tenant '{$name}' has been removed.",
        ]);
    }

    /** PATCH /api/platform/tenants/{id}/status */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:ACTIVE,TRIAL,SUSPENDED,EXPIRED,CANCELLED',
        ]);

        $tenant = Tenant::findOrFail($id);
        $tenant->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => "Tenant status updated to {$request->status}.",
            'data'    => ['id' => $tenant->id, 'status' => $tenant->status],
        ]);
    }

    /** PATCH /api/platform/tenants/{id}/plan */
    public function updatePlan(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'plan' => 'required|in:FREE,STARTER,PRO,ENTERPRISE',
        ]);

        $tenant = Tenant::findOrFail($id);

        $planLimits = [
            'FREE'       => ['employees' => 10,  'storage' => 5],
            'STARTER'    => ['employees' => 50,  'storage' => 20],
            'PRO'        => ['employees' => 200, 'storage' => 100],
            'ENTERPRISE' => ['employees' => 999, 'storage' => 500],
        ];
        $limits = $planLimits[$request->plan];

        $tenant->update([
            'plan'                 => $request->plan,
            'employee_count_limit' => $limits['employees'],
            'storage_cap_gb'       => $limits['storage'],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Plan changed to {$request->plan}.",
            'data'    => ['id' => $tenant->id, 'plan' => $tenant->plan],
        ]);
    }

    /** PUT /api/platform/tenants/{id}/modules */
    public function updateModules(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'modules'          => 'required|array',
            'modules.*'        => 'boolean',
        ]);

        $tenant = Tenant::findOrFail($id);

        foreach ($request->modules as $key => $enabled) {
            TenantModule::updateOrCreate(
                ['tenant_id' => $tenant->id, 'module_key' => $key],
                ['is_enabled' => (bool) $enabled]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Module access updated.',
            'data'    => $tenant->fresh('modules')->modules,
        ]);
    }

    /** POST /api/platform/tenants/{id}/impersonate */
    public function impersonate(Request $request, int $id): JsonResponse
    {
        $tenant = Tenant::with('modules')->findOrFail($id);

        // Get the tenant's owner/super admin user
        $ownerUser = User::withoutGlobalScopes()
            ->where('tenant_id', $tenant->id)
            ->where('role', 'SUPER_ADMIN')
            ->first();

        if (! $ownerUser) {
            return response()->json([
                'success' => false,
                'message' => 'No admin user found for this tenant. Create one first.',
            ], 404);
        }

        // Create short-lived impersonation token
        $ownerUser->tokens()->where('name', 'impersonation_token')->delete();
        $impersonateToken = $ownerUser->createToken('impersonation_token', ['impersonation'])->plainTextToken;

        // Log platform audit
        \App\Models\PlatformAuditLog::create([
            'platform_admin_id' => $request->user('platform_admin')->id,
            'tenant_id'         => $tenant->id,
            'action'            => 'IMPERSONATE',
            'data'              => ['tenant' => $tenant->company_name, 'user' => $ownerUser->email],
            'ip_address'        => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Impersonation token generated for {$tenant->company_name}.",
            'data'    => [
                'impersonate_token' => $impersonateToken,
                'user'              => [
                    'id'    => $ownerUser->id,
                    'name'  => $ownerUser->name,
                    'email' => $ownerUser->email,
                    'role'  => $ownerUser->role,
                ],
                'tenant'            => [
                    'id'           => $tenant->id,
                    'company_name' => $tenant->company_name,
                    'plan'         => $tenant->plan,
                    'modules'      => $tenant->modules->pluck('is_enabled', 'module_key'),
                ],
            ],
        ]);
    }

    /** GET /api/platform/stats */
    public function stats(): JsonResponse
    {
        $tenants = Tenant::all();

        $totalMRR    = $tenants->whereIn('status', ['ACTIVE', 'TRIAL'])->sum('monthly_revenue');
        $activeTenants = $tenants->where('status', 'ACTIVE')->count();
        $trialTenants  = $tenants->where('status', 'TRIAL')->count();
        $totalUsers    = User::withoutGlobalScopes()->count();

        $planBreakdown = $tenants->groupBy('plan')->map->count();

        return response()->json([
            'success' => true,
            'data'    => [
                'total_tenants'  => $tenants->count(),
                'active_tenants' => $activeTenants,
                'trial_tenants'  => $trialTenants,
                'total_mrr'      => $totalMRR,
                'total_users'    => $totalUsers,
                'plan_breakdown' => $planBreakdown,
            ],
        ]);
    }
}
