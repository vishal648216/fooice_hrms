<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkShift extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'start_time',
        'end_time',
        'is_night_shift',
        'break_minutes',
        'working_days',
    ];

    protected $casts = [
        'is_night_shift' => 'boolean',
        'break_minutes'  => 'integer',
        'working_days'   => 'array',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
