<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'employee_code',
        'title',
        'department_id',
        'designation_id',
        'role',
        'status',
        'hourly_rate',
        'date_of_birth',
        'gender',
        'address',
        'emergency_contact',
        'joining_date',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at'     => 'datetime',
            'joining_date'      => 'date',
            'date_of_birth'     => 'date',
            'is_active'         => 'boolean',
            'password'          => 'hashed',
            'hourly_rate'       => 'decimal:2',
        ];
    }

    // ── Boot: Apply TenantScope globally ──────────────────────────────────────
    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

    // ── Relations ─────────────────────────────────────────────────────────────

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }

    public function employeeProfile(): HasOne
    {
        return $this->hasOne(EmployeeProfile::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function leaveAllocations(): HasMany
    {
        return $this->hasMany(LeaveAllocation::class);
    }

    public function managedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'manager_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assignee_id');
    }

    public function payrollRecords(): HasMany
    {
        return $this->hasMany(PayrollRecord::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isPlatformSuperAdmin(): bool
    {
        return $this->role === 'SUPER_ADMIN';
    }

    public function isTenantAdmin(): bool
    {
        return in_array($this->role, ['SUPER_ADMIN', 'MANAGER', 'HR']);
    }

    public function getFullNameAttribute(): string
    {
        return $this->name;
    }
}
