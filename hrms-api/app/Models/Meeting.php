<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meeting extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'title',
        'description',
        'project_id',
        'organizer_id',
        'status',
        'start_time',
        'end_time',
        'meet_url',
        'recording_url',
        'is_recurring',
        'has_ai_notes',
        'ai_notes',
        'action_items_count',
    ];

    protected $casts = [
        'start_time'         => 'datetime',
        'end_time'           => 'datetime',
        'is_recurring'       => 'boolean',
        'has_ai_notes'       => 'boolean',
        'action_items_count' => 'integer',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'meeting_participants')
            ->withPivot('status', 'joined_at', 'left_at')
            ->withTimestamps();
    }
}
