<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Salary structures (templates for payroll calculation)
        Schema::create('salary_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('basic_percent', 5, 2)->default(50.00);   // % of CTC
            $table->decimal('hra_percent', 5, 2)->default(20.00);
            $table->decimal('special_allowance', 5, 2)->default(30.00);
            $table->decimal('pf_employee_percent', 5, 2)->default(12.00);
            $table->decimal('pf_employer_percent', 5, 2)->default(12.00);
            $table->decimal('esic_employee_percent', 5, 2)->default(0.75);
            $table->decimal('esic_employer_percent', 5, 2)->default(3.25);
            $table->decimal('professional_tax', 8, 2)->default(200.00);
            $table->timestamps();

            $table->index('tenant_id');
        });

        // Monthly payroll records per employee
        Schema::create('payroll_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedTinyInteger('month'); // 1-12
            $table->unsignedSmallInteger('year');
            $table->decimal('basic_salary', 12, 2)->default(0);
            $table->decimal('hra', 12, 2)->default(0);
            $table->decimal('special_allowance', 12, 2)->default(0);
            $table->decimal('other_earnings', 12, 2)->default(0);
            $table->decimal('gross_salary', 12, 2)->default(0);
            $table->decimal('pf_deduction', 12, 2)->default(0);
            $table->decimal('esic_deduction', 12, 2)->default(0);
            $table->decimal('tds_deduction', 12, 2)->default(0);
            $table->decimal('other_deductions', 12, 2)->default(0);
            $table->decimal('net_salary', 12, 2)->default(0);
            $table->unsignedInteger('paid_days')->default(0);
            $table->unsignedInteger('loss_of_pay_days')->default(0);
            $table->enum('status', ['DRAFT', 'PROCESSED', 'PAID'])->default('DRAFT');
            $table->date('payment_date')->nullable();
            $table->string('payment_mode')->nullable();
            $table->string('transaction_ref')->nullable();
            $table->unsignedBigInteger('generated_by')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'user_id', 'month', 'year']);
            $table->index(['tenant_id', 'month', 'year']);
            $table->foreign('generated_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
        });

        // Invoices sent to clients
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('invoice_number', 100);
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->date('issue_date');
            $table->date('due_date');
            $table->string('currency', 3)->default('INR');
            $table->decimal('subtotal', 14, 2)->default(0);
            $table->decimal('tax_percent', 5, 2)->default(18.00); // GST 18%
            $table->decimal('tax_amount', 14, 2)->default(0);
            $table->decimal('discount_amount', 14, 2)->default(0);
            $table->decimal('total_amount', 14, 2)->default(0);
            $table->enum('status', ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'])->default('DRAFT');
            $table->date('payment_date')->nullable();
            $table->string('payment_mode')->nullable();
            $table->text('notes')->nullable();
            $table->text('terms')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tenant_id', 'invoice_number']);
            $table->index(['tenant_id', 'client_id', 'status']);
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });

        // Invoice line items
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('invoice_id')->constrained()->onDelete('cascade');
            $table->string('description');
            $table->decimal('quantity', 10, 2)->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->timestamps();

            $table->index(['tenant_id', 'invoice_id']);
        });

        // Employee expense claims
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('category', ['TRAVEL', 'MEALS', 'OFFICE', 'SOFTWARE', 'HARDWARE', 'OTHER'])->default('OTHER');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('INR');
            $table->date('expense_date');
            $table->string('receipt_path')->nullable();
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED', 'REIMBURSED'])->default('PENDING');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['tenant_id', 'user_id', 'status']);
        });

        // Budget planning
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->string('category')->nullable();
            $table->decimal('allocated_amount', 14, 2)->default(0);
            $table->decimal('spent_amount', 14, 2)->default(0);
            $table->date('period_start');
            $table->date('period_end');
            $table->enum('status', ['ACTIVE', 'CLOSED', 'OVERRUN'])->default('ACTIVE');
            $table->timestamps();

            $table->index('tenant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budgets');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('payroll_records');
        Schema::dropIfExists('salary_structures');
    }
};
