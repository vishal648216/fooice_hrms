<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'month',
        'year',
        'basic_salary',
        'hra',
        'special_allowance',
        'other_earnings',
        'gross_salary',
        'pf_deduction',
        'esic_deduction',
        'tds_deduction',
        'other_deductions',
        'net_salary',
        'paid_days',
        'loss_of_pay_days',
        'status',
        'payment_date',
        'payment_mode',
        'transaction_ref',
        'generated_by',
        'approved_by',
    ];

    protected $casts = [
        'month'             => 'integer',
        'year'              => 'integer',
        'basic_salary'      => 'decimal:2',
        'hra'               => 'decimal:2',
        'special_allowance' => 'decimal:2',
        'other_earnings'    => 'decimal:2',
        'gross_salary'      => 'decimal:2',
        'pf_deduction'      => 'decimal:2',
        'esic_deduction'    => 'decimal:2',
        'tds_deduction'     => 'decimal:2',
        'other_deductions'  => 'decimal:2',
        'net_salary'        => 'decimal:2',
        'paid_days'         => 'integer',
        'loss_of_pay_days'  => 'integer',
        'payment_date'      => 'date',
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

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
