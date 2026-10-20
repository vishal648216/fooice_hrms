<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Clients of the tenant company
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('contact_person')->nullable();
            $table->string('email', 191)->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('gst_number', 30)->nullable();
            $table->string('currency', 3)->default('INR');
            $table->enum('status', ['ACTIVE', 'LEAD', 'INACTIVE'])->default('ACTIVE');
            $table->string('avatar')->nullable();
            $table->decimal('total_spent', 14, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('tenant_id');
        });

        // Projects
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('code', 30)->nullable();
            $table->text('description')->nullable();
            $table->foreignId('client_id')->nullable()->constrained()->onDelete('set null');
            $table->unsignedBigInteger('manager_id')->nullable();
            $table->enum('status', ['PLANNING', 'ACTIVE', 'ON_HOLD', 'IN_REVIEW', 'COMPLETED'])->default('PLANNING');
            $table->enum('priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT'])->default('MEDIUM');
            $table->decimal('budget', 14, 2)->default(0);
            $table->decimal('spent', 14, 2)->default(0);
            $table->date('start_date')->nullable();
            $table->date('target_end_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->unsignedTinyInteger('progress_percent')->default(0);
            $table->string('repo_url')->nullable();
            $table->string('color', 10)->default('#6366f1');
            $table->string('cover_image')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('manager_id')->references('id')->on('users')->onDelete('set null');
            $table->index('tenant_id');
            $table->index(['tenant_id', 'status']);
        });

        // Project members (many-to-many with role)
        Schema::create('project_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['LEAD', 'MEMBER', 'OBSERVER'])->default('MEMBER');
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamps();

            $table->unique(['project_id', 'user_id']);
            $table->index(['tenant_id', 'user_id']);
        });

        // Tasks (supports subtasks via parent_task_id)
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('parent_task_id')->nullable(); // subtask support
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('code', 30)->nullable(); // e.g. NP-001
            $table->unsignedBigInteger('assignee_id')->nullable();
            $table->unsignedBigInteger('reporter_id')->nullable();
            $table->enum('status', ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'CLIENT_APPROVAL', 'DONE'])->default('TODO');
            $table->enum('priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT'])->default('MEDIUM');
            $table->date('due_date')->nullable();
            $table->decimal('estimated_hours', 6, 2)->default(0);
            $table->decimal('logged_hours', 6, 2)->default(0);
            $table->unsignedInteger('order_index')->default(0); // Kanban column ordering
            $table->json('labels')->nullable();
            $table->unsignedInteger('attachments_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('parent_task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('assignee_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('reporter_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['tenant_id', 'project_id', 'status']);
            $table->index(['tenant_id', 'assignee_id']);
        });

        // Task comments
        Schema::create('task_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->json('mentions')->nullable(); // [user_ids]
            $table->boolean('is_edited')->default(false);
            $table->timestamp('edited_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'task_id']);
        });

        // Task time logs
        Schema::create('task_time_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('logged_hours', 6, 2);
            $table->text('description')->nullable();
            $table->date('logged_date');
            $table->timestamps();

            $table->index(['tenant_id', 'task_id']);
        });

        // Project milestones
        Schema::create('milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'project_id']);
        });

        // Requirement documents per project
        Schema::create('requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->longText('description')->nullable();
            $table->enum('status', ['DRAFT', 'REVIEWED', 'APPROVED', 'CHANGES_REQUESTED'])->default('DRAFT');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['tenant_id', 'project_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('requirements');
        Schema::dropIfExists('milestones');
        Schema::dropIfExists('task_time_logs');
        Schema::dropIfExists('task_comments');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('project_members');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('clients');
    }
};
