<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tenant_id',
        'designation_id',
        'employment_type',
        'salary_type',
        'base_salary',
        'bank_account_number',
        'bank_name',
        'ifsc_code',
        'pan_number',
        'aadhaar_number',
        'skills',
        'certifications',
        'probation_end_date',
        'confirmed_date',
        'resignation_date',
        'exit_date',
        'reporting_manager_id',
    ];

    protected $casts = [
        'base_salary'        => 'decimal:2',
        'skills'             => 'array',
        'certifications'     => 'array',
        'probation_end_date' => 'date',
        'confirmed_date'     => 'date',
        'resignation_date'   => 'date',
        'exit_date'          => 'date',
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

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }

    public function reportingManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporting_manager_id');
    }
}
