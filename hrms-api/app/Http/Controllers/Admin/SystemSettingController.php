<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    /** GET /api/settings */
    public function index(Request $request): JsonResponse
    {
        $settings = SystemSetting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data'    => $settings,
        ]);
    }

    /** POST /api/settings/bulk */
    public function updateBulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        $tenantId = $request->user()->tenant_id;
        $userId   = $request->user()->id;

        foreach ($validated['settings'] as $key => $value) {
            SystemSetting::updateOrCreate(
                ['tenant_id' => $tenantId, 'key' => $key],
                [
                    'value'      => is_array($value) ? json_encode($value) : (string) $value,
                    'type'       => is_array($value) ? 'JSON' : (is_bool($value) ? 'BOOL' : (is_numeric($value) ? 'NUMBER' : 'STRING')),
                    'updated_by' => $userId,
                ]
            );
        }

        $allSettings = SystemSetting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'message' => 'Settings saved successfully.',
            'data'    => $allSettings,
        ]);
    }
}
