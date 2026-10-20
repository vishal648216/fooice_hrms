<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Extended HR data for employees — sensitive info separate from users
        Schema::create('employee_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('designation_id')->nullable();
            $table->enum('employment_type', ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'])->default('FULL_TIME');
            $table->enum('salary_type', ['MONTHLY', 'HOURLY', 'DAILY'])->default('MONTHLY');
            $table->decimal('base_salary', 12, 2)->default(0);
            // Bank / Compliance — encrypted at application layer in production
            $table->string('bank_account_number', 100)->nullable();
            $table->string('bank_name')->nullable();
            $table->string('ifsc_code', 20)->nullable();
            $table->string('pan_number', 20)->nullable();
            $table->string('aadhaar_number', 20)->nullable();
            $table->json('skills')->nullable();            // ["PHP", "Laravel", "MySQL"]
            $table->json('certifications')->nullable();    // [{"name":"AWS","year":2023}]
            $table->date('probation_end_date')->nullable();
            $table->date('confirmed_date')->nullable();
            $table->date('resignation_date')->nullable();
            $table->date('exit_date')->nullable();
            $table->unsignedBigInteger('reporting_manager_id')->nullable();
            $table->timestamps();

            $table->foreign('reporting_manager_id')->references('id')->on('users')->onDelete('set null');
            $table->index('tenant_id');
        });

        // Work Shifts (e.g. Morning: 9AM-6PM, Night: 10PM-6AM)
        Schema::create('work_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_night_shift')->default(false);
            $table->unsignedInteger('break_minutes')->default(60);
            $table->json('working_days')->nullable(); // 1=Mon ... 7=Sun, set via seeder/code
            $table->timestamps();

            $table->index('tenant_id');
        });

        // Employee ↔ Shift assignment (with date ranges for shift changes)
        Schema::create('employee_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('work_shift_id')->constrained()->onDelete('cascade');
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_shifts');
        Schema::dropIfExists('work_shifts');
        Schema::dropIfExists('employee_profiles');
    }
};
