<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('slug', 191)->unique();
            $table->string('owner_name');
            $table->string('owner_email', 191);
            $table->string('owner_phone', 20)->nullable();
            $table->string('industry')->nullable();
            $table->string('location')->nullable();
            $table->string('logo')->nullable();
            $table->enum('plan', ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'])->default('FREE');
            $table->enum('status', ['ACTIVE', 'TRIAL', 'SUSPENDED', 'EXPIRED', 'CANCELLED'])->default('TRIAL');
            $table->unsignedInteger('employee_count_limit')->default(10);
            $table->decimal('storage_cap_gb', 8, 2)->default(5.00);
            $table->decimal('storage_used_gb', 8, 2)->default(0.00);
            $table->decimal('monthly_revenue', 10, 2)->default(0.00);
            $table->timestamp('trial_ends_at')->nullable();
            $table->date('next_billing_date')->nullable();
            $table->date('joined_date')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
