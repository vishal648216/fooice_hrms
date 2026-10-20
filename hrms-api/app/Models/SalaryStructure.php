<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalaryStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'basic_percent',
        'hra_percent',
        'special_allowance',
        'pf_employee_percent',
        'pf_employer_percent',
        'esic_employee_percent',
        'esic_employer_percent',
        'professional_tax',
    ];

    protected $casts = [
        'basic_percent'         => 'decimal:2',
        'hra_percent'           => 'decimal:2',
        'special_allowance'     => 'decimal:2',
        'pf_employee_percent'   => 'decimal:2',
        'pf_employer_percent'   => 'decimal:2',
        'esic_employee_percent' => 'decimal:2',
        'esic_employer_percent' => 'decimal:2',
        'professional_tax'      => 'decimal:2',
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
