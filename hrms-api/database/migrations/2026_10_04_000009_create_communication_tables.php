<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Client portal access control
        Schema::create('client_portal_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // user with role=CLIENT
            $table->boolean('can_view_invoices')->default(true);
            $table->boolean('can_view_projects')->default(true);
            $table->boolean('can_approve_tasks')->default(false);
            $table->boolean('can_submit_tickets')->default(true);
            $table->timestamps();

            $table->unique(['tenant_id', 'client_id', 'user_id']);
        });

        // Support tickets (from clients)
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('created_by');
            $table->string('subject');
            $table->text('description');
            $table->enum('priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT'])->default('MEDIUM');
            $table->enum('status', ['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'])->default('OPEN');
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->index(['tenant_id', 'client_id', 'status']);
        });

        // Ticket reply threads
        Schema::create('ticket_replies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('support_ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('message');
            $table->boolean('is_internal')->default(false); // internal notes
            $table->timestamps();

            $table->index(['tenant_id', 'support_ticket_id']);
        });

        // Chat channels (public, private, direct, group)
        Schema::create('chat_channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['PUBLIC', 'PRIVATE', 'DIRECT', 'GROUP'])->default('PUBLIC');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->index('tenant_id');
        });

        // Channel members pivot
        Schema::create('chat_channel_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('chat_channel_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['ADMIN', 'MEMBER'])->default('MEMBER');
            $table->timestamp('last_read_at')->nullable();
            $table->timestamps();

            $table->unique(['chat_channel_id', 'user_id']);
            $table->index(['tenant_id', 'user_id']);
        });

        // Chat messages (with thread support via parent_message_id)
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('chat_channel_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content')->nullable();
            $table->enum('type', ['TEXT', 'FILE', 'IMAGE', 'SYSTEM'])->default('TEXT');
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->unsignedBigInteger('parent_message_id')->nullable(); // thread reply
            $table->json('reactions')->nullable(); // {"👍": [user_ids]}
            $table->boolean('is_edited')->default(false);
            $table->timestamp('edited_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            $table->foreign('parent_message_id')->references('id')->on('chat_messages')->onDelete('set null');
            $table->index(['tenant_id', 'chat_channel_id']);
        });

        // Meetings
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->unsignedBigInteger('organizer_id');
            $table->enum('status', ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])->default('SCHEDULED');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('meet_url')->nullable();
            $table->string('recording_url')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->boolean('has_ai_notes')->default(false);
            $table->text('ai_notes')->nullable();
            $table->unsignedInteger('action_items_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('organizer_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['tenant_id', 'start_time']);
        });

        // Meeting participants pivot
        Schema::create('meeting_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('meeting_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['INVITED', 'ACCEPTED', 'DECLINED', 'TENTATIVE'])->default('INVITED');
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('left_at')->nullable();
            $table->timestamps();

            $table->unique(['meeting_id', 'user_id']);
            $table->index(['tenant_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_participants');
        Schema::dropIfExists('meetings');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_channel_members');
        Schema::dropIfExists('chat_channels');
        Schema::dropIfExists('ticket_replies');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('client_portal_users');
    }
};
