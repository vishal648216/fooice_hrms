<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Departments (created before users because users.department_id references it)
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('code', 20)->nullable();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('head_user_id')->nullable();   // FK added after users table
            $table->unsignedBigInteger('parent_department_id')->nullable(); // self-ref
            $table->string('color', 10)->default('#6366f1');
            $table->timestamps();
            $table->softDeletes();

            $table->index('tenant_id');
            $table->index('parent_department_id');
        });

        // Designations / Job Titles
        Schema::create('designations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->unsignedInteger('level')->default(1);
            $table->timestamps();

            $table->index('tenant_id');
        });

        // Users (all tenant employees, managers, HR, clients)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email', 191);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone', 20)->nullable();
            $table->string('avatar')->nullable();
            $table->string('employee_code', 50)->nullable();
            $table->string('title')->nullable();            // "Senior Backend Dev"
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->unsignedBigInteger('designation_id')->nullable();
            $table->enum('role', ['SUPER_ADMIN', 'MANAGER', 'HR', 'EMPLOYEE', 'CLIENT'])->default('EMPLOYEE');
            $table->enum('status', ['ONLINE', 'IN_MEETING', 'BUSY', 'AWAY', 'OFFLINE'])->default('OFFLINE');
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['MALE', 'FEMALE', 'OTHER'])->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->date('joining_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'email']);
            $table->unique(['tenant_id', 'employee_code']);
            $table->index('tenant_id');
            $table->index(['tenant_id', 'role']);
            $table->index(['tenant_id', 'department_id']);
        });

        // Add FK from departments.head_user_id → users.id  (after users table exists)
        Schema::table('departments', function (Blueprint $table) {
            $table->foreign('head_user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('parent_department_id')->references('id')->on('departments')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['head_user_id']);
            $table->dropForeign(['parent_department_id']);
        });
        Schema::dropIfExists('users');
        Schema::dropIfExists('designations');
        Schema::dropIfExists('departments');
    }
};
