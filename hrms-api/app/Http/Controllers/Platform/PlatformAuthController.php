<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\PlatformAdmin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Platform Super Admin — Authentication Controller
 * Guard: platform_admin (separate from tenant users)
 * Routes: /api/platform/login, /api/platform/logout, /api/platform/me
 */
class PlatformAuthController extends Controller
{
    /** POST /api/platform/login */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = PlatformAdmin::where('email', $request->email)->first();

        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['The credentials you entered are incorrect.'],
            ]);
        }

        // Update last login info
        $admin->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // Revoke old tokens and create new one
        $admin->tokens()->delete();
        $token = $admin->createToken('platform_admin_token', ['platform_admin'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Platform Super Admin authenticated successfully.',
            'data'    => [
                'token'        => $token,
                'token_type'   => 'Bearer',
                'admin'        => [
                    'id'    => $admin->id,
                    'name'  => $admin->name,
                    'email' => $admin->email,
                ],
                'guard'        => 'platform_admin',
            ],
        ]);
    }

    /** POST /api/platform/logout */
    public function logout(Request $request): JsonResponse
    {
        $request->user('platform_admin')?->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Platform Admin logged out successfully.',
        ]);
    }

    /** GET /api/platform/me */
    public function me(Request $request): JsonResponse
    {
        $admin = $request->user('platform_admin');

        return response()->json([
            'success' => true,
            'data'    => [
                'id'            => $admin->id,
                'name'          => $admin->name,
                'email'         => $admin->email,
                'last_login_at' => $admin->last_login_at,
                'guard'         => 'platform_admin',
            ],
        ]);
    }
}
