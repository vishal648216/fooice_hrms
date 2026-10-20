<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'project_id',
        'department_id',
        'title',
        'category',
        'allocated_amount',
        'spent_amount',
        'period_start',
        'period_end',
        'status',
    ];

    protected $casts = [
        'allocated_amount' => 'decimal:2',
        'spent_amount'     => 'decimal:2',
        'period_start'     => 'date',
        'period_end'       => 'date',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
