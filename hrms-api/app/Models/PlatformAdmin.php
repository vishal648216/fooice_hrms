<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * PlatformAdmin — Root SaaS owner.
 * Has its OWN guard ('platform_admin') + OWN Sanctum token table.
 * NOT tenant-scoped — sees everything.
 */
class PlatformAdmin extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'two_factor_secret',
        'two_factor_confirmed_at',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected function casts(): array
    {
        return [
            'last_login_at'            => 'datetime',
            'two_factor_confirmed_at'  => 'datetime',
            'password'                 => 'hashed',
        ];
    }

    // ── Relations ─────────────────────────────────────────────────────────────

    public function tenants(): HasMany
    {
        // Platform admin can see all tenants (no scope)
        return $this->hasMany(Tenant::class, 'updated_by'); // if tracking who created
    }
}
