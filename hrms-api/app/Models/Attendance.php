<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'date',
        'clock_in',
        'clock_out',
        'total_hours',
        'overtime_hours',
        'status',
        'clock_in_ip',
        'clock_out_ip',
        'clock_in_location',
        'notes',
        'approved_by',
    ];

    protected $casts = [
        'date'              => 'date',
        'clock_in'          => 'datetime',
        'clock_out'         => 'datetime',
        'total_hours'       => 'decimal:2',
        'overtime_hours'    => 'decimal:2',
        'clock_in_location' => 'array',
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

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
