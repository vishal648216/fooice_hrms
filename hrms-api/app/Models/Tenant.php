<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_name',
        'slug',
        'owner_name',
        'owner_email',
        'owner_phone',
        'industry',
        'location',
        'logo',
        'plan',
        'status',
        'employee_count_limit',
        'storage_cap_gb',
        'storage_used_gb',
        'monthly_revenue',
        'trial_ends_at',
        'next_billing_date',
        'joined_date',
        'last_login_at',
    ];

    protected function casts(): array
    {
        return [
            'trial_ends_at'      => 'datetime',
            'next_billing_date'  => 'date',
            'joined_date'        => 'date',
            'last_login_at'      => 'datetime',
            'storage_cap_gb'     => 'decimal:2',
            'storage_used_gb'    => 'decimal:2',
            'monthly_revenue'    => 'decimal:2',
        ];
    }

    // ── Relations ─────────────────────────────────────────────────────────────

    public function users(): HasMany
    {
        return $this->hasMany(User::class)->withoutGlobalScopes();
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class)->withoutGlobalScopes();
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class)->withoutGlobalScopes();
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class)->withoutGlobalScopes();
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class)->withoutGlobalScopes();
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class)->withoutGlobalScopes();
    }

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class)->withoutGlobalScopes();
    }

    public function modules(): HasMany
    {
        return $this->hasMany(TenantModule::class);
    }

    public function billingHistory(): HasMany
    {
        return $this->hasMany(BillingHistory::class);
    }

    public function owner(): HasOne
    {
        return $this->hasOne(User::class)->withoutGlobalScopes()->where('role', 'SUPER_ADMIN');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Get module enabled/disabled map as associative array */
    public function getModulesMapAttribute(): array
    {
        return $this->modules->pluck('is_enabled', 'module_key')->toArray();
    }

    public function isModuleEnabled(string $moduleKey): bool
    {
        $mod = $this->modules->firstWhere('module_key', $moduleKey);
        return $mod ? (bool) $mod->is_enabled : true; // default enabled if not configured
    }

    public function isActive(): bool
    {
        return in_array($this->status, ['ACTIVE', 'TRIAL']);
    }
}
