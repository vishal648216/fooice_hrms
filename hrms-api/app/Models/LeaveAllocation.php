<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveAllocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'leave_type_id',
        'year',
        'total_days',
        'used_days',
    ];

    protected $casts = [
        'year'       => 'integer',
        'total_days' => 'decimal:1',
        'used_days'  => 'decimal:1',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }
}
