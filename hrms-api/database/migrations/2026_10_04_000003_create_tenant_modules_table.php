<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('module_key', 50); // dashboard, employees, attendance, etc.
            $table->boolean('is_enabled')->default(true);
            $table->unsignedBigInteger('updated_by')->nullable(); // platform_admin_id
            $table->timestamps();

            $table->unique(['tenant_id', 'module_key']);
            $table->index('tenant_id');
        });

        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->enum('name', ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'])->unique();
            $table->decimal('price_monthly', 10, 2)->default(0);
            $table->unsignedInteger('employee_limit')->default(10);
            $table->decimal('storage_gb', 8, 2)->default(5);
            $table->json('features')->nullable();
            $table->timestamps();
        });

        Schema::create('billing_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->enum('plan', ['FREE', 'STARTER', 'PRO', 'ENTERPRISE']);
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('INR');
            $table->enum('status', ['PENDING', 'PAID', 'FAILED', 'REFUNDED'])->default('PENDING');
            $table->string('payment_method')->nullable();
            $table->string('invoice_number', 100)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index('tenant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_history');
        Schema::dropIfExists('subscription_plans');
        Schema::dropIfExists('tenant_modules');
    }
};
