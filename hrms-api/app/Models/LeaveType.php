<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'max_days_per_year',
        'carry_forward_limit',
        'is_paid',
        'color',
    ];

    protected $casts = [
        'max_days_per_year'   => 'integer',
        'carry_forward_limit' => 'integer',
        'is_paid'             => 'boolean',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function leaveAllocations(): HasMany
    {
        return $this->hasMany(LeaveAllocation::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }
}
