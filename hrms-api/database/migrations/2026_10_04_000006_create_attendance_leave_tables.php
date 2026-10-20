<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Attendance records — one per employee per day
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->dateTime('clock_in')->nullable();
            $table->dateTime('clock_out')->nullable();
            $table->decimal('total_hours', 4, 2)->nullable();
            $table->decimal('overtime_hours', 4, 2)->default(0);
            $table->enum('status', ['ON_TIME', 'LATE', 'EARLY_LEAVE', 'ABSENT', 'ON_LEAVE', 'REMOTE', 'HOLIDAY'])->default('ABSENT');
            $table->string('clock_in_ip', 45)->nullable();
            $table->string('clock_out_ip', 45)->nullable();
            $table->json('clock_in_location')->nullable(); // {lat, lng, address}
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'user_id', 'date']);
            $table->index(['tenant_id', 'date']);
            $table->index(['tenant_id', 'user_id']);
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
        });

        // Leave types catalog per tenant
        Schema::create('leave_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->enum('name', ['SICK', 'CASUAL', 'VACATION', 'MATERNITY', 'PATERNITY', 'COMPENSATORY', 'OTHER']);
            $table->unsignedInteger('max_days_per_year')->default(0);
            $table->unsignedInteger('carry_forward_limit')->default(0);
            $table->boolean('is_paid')->default(true);
            $table->string('color', 10)->default('#6366f1');
            $table->timestamps();

            $table->unique(['tenant_id', 'name']);
            $table->index('tenant_id');
        });

        // Annual leave allocation per employee
        Schema::create('leave_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained()->onDelete('cascade');
            $table->unsignedSmallInteger('year');
            $table->decimal('total_days', 5, 1)->default(0);
            $table->decimal('used_days', 5, 1)->default(0);
            $table->timestamps();

            $table->unique(['tenant_id', 'user_id', 'leave_type_id', 'year']);
            $table->index(['tenant_id', 'user_id']);
        });

        // Leave requests submitted by employees
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_days', 5, 1);
            $table->text('reason');
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'])->default('PENDING');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('document_path')->nullable();
            $table->timestamps();

            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['tenant_id', 'user_id', 'status']);
            $table->index('tenant_id');
        });

        // Company holidays
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->date('date');
            $table->enum('type', ['NATIONAL', 'REGIONAL', 'OPTIONAL'])->default('NATIONAL');
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();

            $table->index(['tenant_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holidays');
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('leave_allocations');
        Schema::dropIfExists('leave_types');
        Schema::dropIfExists('attendances');
    }
};
