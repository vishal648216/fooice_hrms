<?php

namespace App\Models;

use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'chat_channel_id',
        'user_id',
        'content',
        'type',
        'file_path',
        'file_name',
        'file_size',
        'parent_message_id',
        'reactions',
        'is_edited',
        'edited_at',
        'deleted_at',
    ];

    protected $casts = [
        'reactions'  => 'array',
        'is_edited'  => 'boolean',
        'edited_at'  => 'datetime',
        'deleted_at' => 'datetime',
        'file_size'  => 'integer',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function channel(): BelongsTo
    {
        return $this->belongsTo(ChatChannel::class, 'chat_channel_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parentMessage(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'parent_message_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'parent_message_id');
    }
}
