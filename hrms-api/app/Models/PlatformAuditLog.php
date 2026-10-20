<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformAuditLog extends Model
{
    protected $fillable = [
        'platform_admin_id',
        'tenant_id',
        'action',
        'data',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }
}
