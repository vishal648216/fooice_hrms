<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Tenant User Authentication Controller
 * Guard: sanctum (default)
 * Routes: /api/auth/*
 */
class AuthController extends Controller
{
    /** POST /api/auth/login */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Find user across all tenants by email (then check password)
        $user = User::withoutGlobalScopes()
            ->where('email', $request->email)
            ->where('is_active', true)
            ->with(['tenant', 'tenant.modules', 'department'])
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        // Check tenant is active
        if (! $user->tenant || ! $user->tenant->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is currently suspended. Please contact your administrator.',
            ], 403);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);
        $user->tenant->update(['last_login_at' => now()]);

        // Revoke old & create new Sanctum token
        $user->tokens()->where('name', 'auth_token')->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Authenticated successfully.',
            'data'    => [
                'token'      => $token,
                'token_type' => 'Bearer',
                'user'       => $this->formatUser($user),
                'tenant'     => $this->formatTenant($user->tenant),
            ],
        ]);
    }

    /** POST /api/auth/logout */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    /** GET /api/auth/me */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load(['tenant', 'tenant.modules', 'department', 'designation', 'employeeProfile']);

        return response()->json([
            'success' => true,
            'data'    => [
                'user'   => $this->formatUser($user),
                'tenant' => $this->formatTenant($user->tenant),
            ],
        ]);
    }

    /** POST /api/auth/refresh */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data'    => ['token' => $token, 'token_type' => 'Bearer'],
        ]);
    }

    /** PUT /api/auth/password */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }

    // ── Formatters ────────────────────────────────────────────────────────────

    private function formatUser(User $user): array
    {
        return [
            'id'            => $user->id,
            'tenant_id'     => $user->tenant_id,
            'name'          => $user->name,
            'email'         => $user->email,
            'phone'         => $user->phone,
            'avatar'        => $user->avatar,
            'employee_code' => $user->employee_code,
            'title'         => $user->title,
            'role'          => $user->role,
            'status'        => $user->status,
            'department_id' => $user->department_id,
            'joining_date'  => $user->joining_date,
            'last_login_at' => $user->last_login_at,
        ];
    }

    private function formatTenant(\App\Models\Tenant $tenant): array
    {
        return [
            'id'           => $tenant->id,
            'company_name' => $tenant->company_name,
            'slug'         => $tenant->slug,
            'logo'         => $tenant->logo,
            'plan'         => $tenant->plan,
            'status'       => $tenant->status,
            'modules'      => $tenant->modules->pluck('is_enabled', 'module_key'),
        ];
    }
}
