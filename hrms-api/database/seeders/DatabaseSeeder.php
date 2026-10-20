<?php

namespace Database\Seeders;

use App\Models\PlatformAdmin;
use App\Models\Tenant;
use App\Models\TenantModule;
use App\Models\User;
use App\Models\Department;
use App\Models\Designation;
use App\Models\EmployeeProfile;
use App\Models\LeaveType;
use App\Models\Holiday;
use App\Models\WorkShift;
use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Expense;
use App\Models\SalaryStructure;
use App\Models\ChatChannel;
use App\Models\ChatMessage;
use App\Models\Meeting;
use App\Models\Asset;
use App\Models\SystemSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PlatformAdminSeeder::class,
            DemoTenantSeeder::class,
        ]);
    }
}

class PlatformAdminSeeder extends Seeder
{
    public function run(): void
    {
        PlatformAdmin::updateOrCreate(
            ['email' => 'admin@hrms.com'],
            [
                'name'     => 'Platform Super Admin',
                'email'    => 'admin@hrms.com',
                'password' => Hash::make('Admin@12345'),
            ]
        );

        $this->command->info('✅ Platform Super Admin: admin@hrms.com / Admin@12345');
    }
}

class DemoTenantSeeder extends Seeder
{
    protected array $allModuleKeys = [
        'dashboard', 'employees', 'attendance', 'leave', 'payroll',
        'projects', 'tasks', 'chat', 'meetings', 'whiteboard',
        'clients', 'finance', 'files', 'ai', 'analytics',
    ];

    public function run(): void
    {
        // ── 1. TechCorp Solutions (PRO) ────────────────────────────────────
        $tenant1 = Tenant::updateOrCreate(
            ['slug' => 'techcorp'],
            [
                'company_name'         => 'TechCorp Solutions',
                'owner_name'           => 'Rahul Mehta',
                'owner_email'          => 'rahul@techcorp.com',
                'owner_phone'          => '+91 98765 43210',
                'industry'             => 'Technology',
                'location'             => 'Mumbai, India',
                'plan'                 => 'PRO',
                'status'               => 'ACTIVE',
                'employee_count_limit' => 200,
                'storage_cap_gb'       => 100,
                'monthly_revenue'      => 4999,
                'joined_date'          => now()->subMonths(6)->toDateString(),
                'next_billing_date'    => now()->addMonth()->toDateString(),
            ]
        );

        foreach ($this->allModuleKeys as $key) {
            TenantModule::updateOrCreate(
                ['tenant_id' => $tenant1->id, 'module_key' => $key],
                ['is_enabled' => true]
            );
        }

        // Departments & Designations
        $engDept = Department::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'Engineering'],
            ['code' => 'ENG', 'color' => '#0ea5e9']
        );
        $hrDept = Department::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'Human Resources'],
            ['code' => 'HR', 'color' => '#6366f1']
        );
        $designDept = Department::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'Design & UI/UX'],
            ['code' => 'DES', 'color' => '#ec4899']
        );

        $devDesig = Designation::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'Senior Full Stack Developer'],
            ['department_id' => $engDept->id, 'level' => 3]
        );
        $hrDesig = Designation::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'HR Manager'],
            ['department_id' => $hrDept->id, 'level' => 2]
        );

        // TechCorp Users
        $admin1 = User::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'email' => 'rahul@techcorp.com'],
            [
                'name'          => 'Rahul Mehta',
                'password'      => Hash::make('TechCorp@123'),
                'role'          => 'SUPER_ADMIN',
                'title'         => 'Chief Executive Officer',
                'employee_code' => 'TC-001',
                'department_id' => $engDept->id,
                'designation_id'=> $devDesig->id,
                'phone'         => '+91 98765 43210',
                'joining_date'  => '2023-01-15',
                'is_active'     => true,
            ]
        );
        $engDept->update(['head_user_id' => $admin1->id]);

        $emp1 = User::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'email' => 'priya@techcorp.com'],
            [
                'name'          => 'Priya Sharma',
                'password'      => Hash::make('TechCorp@123'),
                'role'          => 'EMPLOYEE',
                'title'         => 'Lead Frontend Engineer',
                'employee_code' => 'TC-002',
                'department_id' => $engDept->id,
                'phone'         => '+91 98765 43211',
                'joining_date'  => '2023-03-01',
                'is_active'     => true,
            ]
        );

        $hrUser = User::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'email' => 'anita@techcorp.com'],
            [
                'name'          => 'Anita Desai',
                'password'      => Hash::make('TechCorp@123'),
                'role'          => 'HR',
                'title'         => 'HR Director',
                'employee_code' => 'TC-003',
                'department_id' => $hrDept->id,
                'designation_id'=> $hrDesig->id,
                'phone'         => '+91 98765 43212',
                'joining_date'  => '2023-02-10',
                'is_active'     => true,
            ]
        );

        // Employee Profiles
        EmployeeProfile::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'user_id' => $admin1->id],
            [
                'employment_type' => 'FULL_TIME',
                'salary_type'     => 'MONTHLY',
                'base_salary'     => 150000.00,
                'skills'          => ['Laravel', 'React', 'Node.js', 'System Architecture'],
            ]
        );
        EmployeeProfile::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'user_id' => $emp1->id],
            [
                'employment_type'      => 'FULL_TIME',
                'salary_type'          => 'MONTHLY',
                'base_salary'          => 85000.00,
                'skills'               => ['React', 'Next.js', 'TypeScript', 'Tailwind'],
                'reporting_manager_id' => $admin1->id,
            ]
        );
        EmployeeProfile::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'user_id' => $hrUser->id],
            [
                'employment_type' => 'FULL_TIME',
                'salary_type'     => 'MONTHLY',
                'base_salary'     => 75000.00,
                'skills'          => ['Talent Acquisition', 'Payroll', 'Compliance'],
            ]
        );

        // Leave Types
        $leaveTypes = [
            ['name' => 'CASUAL', 'max_days_per_year' => 12, 'carry_forward_limit' => 3, 'color' => '#3b82f6'],
            ['name' => 'SICK', 'max_days_per_year' => 10, 'carry_forward_limit' => 0, 'color' => '#ef4444'],
            ['name' => 'VACATION', 'max_days_per_year' => 15, 'carry_forward_limit' => 5, 'color' => '#10b981'],
        ];
        foreach ($leaveTypes as $lt) {
            LeaveType::updateOrCreate(
                ['tenant_id' => $tenant1->id, 'name' => $lt['name']],
                $lt
            );
        }

        // Shifts & Holidays
        WorkShift::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'General Day Shift'],
            [
                'start_time'     => '09:30:00',
                'end_time'       => '18:30:00',
                'break_minutes'  => 60,
                'is_night_shift' => false,
                'working_days'   => [1, 2, 3, 4, 5],
            ]
        );

        Holiday::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'Diwali'],
            ['date' => '2026-11-08', 'type' => 'NATIONAL', 'is_recurring' => false]
        );
        Holiday::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'Christmas'],
            ['date' => '2026-12-25', 'type' => 'NATIONAL', 'is_recurring' => true]
        );

        // Client & Projects
        $client1 = Client::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'company_name' => 'Acme Global Corp'],
            [
                'contact_person' => 'John Sterling',
                'email'          => 'john@acmeglobal.com',
                'phone'          => '+1 555 123 4567',
                'city'           => 'New York',
                'country'        => 'USA',
                'currency'       => 'USD',
                'status'         => 'ACTIVE',
            ]
        );

        $proj1 = Project::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'code' => 'PRJ-ACME-01'],
            [
                'name'             => 'Acme E-Commerce Redesign',
                'description'      => 'Next.js 15 & Laravel microservices architecture for Acme store.',
                'client_id'        => $client1->id,
                'manager_id'       => $admin1->id,
                'status'           => 'ACTIVE',
                'priority'         => 'HIGH',
                'budget'           => 35000.00,
                'spent'            => 12500.00,
                'progress_percent' => 45,
                'start_date'       => '2026-09-01',
                'target_end_date'  => '2026-12-31',
                'color'            => '#6366f1',
            ]
        );

        $proj1->members()->syncWithoutDetaching([
            $admin1->id => ['tenant_id' => $tenant1->id, 'role' => 'LEAD'],
            $emp1->id   => ['tenant_id' => $tenant1->id, 'role' => 'MEMBER'],
        ]);

        // Tasks
        Task::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'project_id' => $proj1->id, 'code' => 'ACME-101'],
            [
                'title'           => 'Implement Cart & Checkout with Stripe API',
                'description'     => 'Build responsive checkout drawer with one-click payment.',
                'assignee_id'     => $emp1->id,
                'reporter_id'     => $admin1->id,
                'status'          => 'IN_PROGRESS',
                'priority'        => 'HIGH',
                'due_date'        => '2026-10-20',
                'estimated_hours' => 24.00,
                'logged_hours'    => 14.50,
                'labels'          => ['Frontend', 'Stripe', 'High Priority'],
            ]
        );

        Task::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'project_id' => $proj1->id, 'code' => 'ACME-102'],
            [
                'title'           => 'Database Indexing & Query Optimizations',
                'description'     => 'Audit SQL queries and ensure all tenant keys are indexed.',
                'assignee_id'     => $admin1->id,
                'reporter_id'     => $admin1->id,
                'status'          => 'TODO',
                'priority'        => 'MEDIUM',
                'due_date'        => '2026-10-25',
                'estimated_hours' => 12.00,
                'labels'          => ['Backend', 'Performance'],
            ]
        );

        // Invoices
        $inv1 = Invoice::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'invoice_number' => 'INV-2026-0001'],
            [
                'client_id'       => $client1->id,
                'project_id'      => $proj1->id,
                'issue_date'      => '2026-09-15',
                'due_date'        => '2026-10-15',
                'currency'        => 'USD',
                'subtotal'        => 12000.00,
                'tax_percent'     => 18.00,
                'tax_amount'      => 2160.00,
                'total_amount'    => 14160.00,
                'status'          => 'PAID',
                'payment_date'    => '2026-10-01',
                'payment_mode'    => 'WIRE_TRANSFER',
                'created_by'      => $admin1->id,
            ]
        );

        InvoiceItem::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'invoice_id' => $inv1->id, 'description' => 'Milestone 1 — UI System & Wireframes'],
            ['quantity' => 1, 'unit_price' => 12000.00, 'total' => 12000.00]
        );

        // Chat Channels
        $genChannel = ChatChannel::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'name' => 'general'],
            [
                'description' => 'Company-wide announcements and watercooler discussions.',
                'type'        => 'PUBLIC',
                'created_by'  => $admin1->id,
            ]
        );
        $genChannel->members()->syncWithoutDetaching([
            $admin1->id => ['tenant_id' => $tenant1->id, 'role' => 'ADMIN'],
            $emp1->id   => ['tenant_id' => $tenant1->id, 'role' => 'MEMBER'],
            $hrUser->id => ['tenant_id' => $tenant1->id, 'role' => 'MEMBER'],
        ]);

        ChatMessage::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'chat_channel_id' => $genChannel->id, 'content' => 'Welcome everyone to the new HRMS portal! 🚀'],
            ['user_id' => $admin1->id, 'type' => 'TEXT']
        );

        // Assets & Settings
        Asset::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'asset_code' => 'AST-MBP-01'],
            [
                'name'           => 'MacBook Pro 16" M3 Max',
                'category'       => 'LAPTOP',
                'assigned_to'    => $emp1->id,
                'purchase_date'  => '2024-04-10',
                'purchase_price' => 2499.00,
                'status'         => 'ASSIGNED',
            ]
        );

        SystemSetting::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'key' => 'company_name'],
            ['value' => 'TechCorp Solutions', 'type' => 'STRING', 'updated_by' => $admin1->id]
        );
        SystemSetting::updateOrCreate(
            ['tenant_id' => $tenant1->id, 'key' => 'currency'],
            ['value' => 'INR', 'type' => 'STRING', 'updated_by' => $admin1->id]
        );

        // ── 2. StartupXYZ (Trial Tenant) ───────────────────────────────────
        $tenant2 = Tenant::updateOrCreate(
            ['slug' => 'startupxyz'],
            [
                'company_name'         => 'StartupXYZ Labs',
                'owner_name'           => 'Ankit Verma',
                'owner_email'          => 'ankit@startupxyz.com',
                'plan'                 => 'FREE',
                'status'               => 'TRIAL',
                'trial_ends_at'        => now()->addDays(14)->toDateString(),
                'employee_count_limit' => 10,
                'storage_cap_gb'       => 5,
                'monthly_revenue'      => 0,
                'joined_date'          => now()->toDateString(),
            ]
        );

        $trialModules = ['dashboard', 'employees', 'attendance', 'leave', 'tasks'];
        foreach ($this->allModuleKeys as $key) {
            TenantModule::updateOrCreate(
                ['tenant_id' => $tenant2->id, 'module_key' => $key],
                ['is_enabled' => in_array($key, $trialModules)]
            );
        }

        User::updateOrCreate(
            ['tenant_id' => $tenant2->id, 'email' => 'ankit@startupxyz.com'],
            [
                'name'          => 'Ankit Verma',
                'password'      => Hash::make('Startup@123'),
                'role'          => 'SUPER_ADMIN',
                'title'         => 'Founder',
                'employee_code' => 'SXYZ-01',
                'is_active'     => true,
            ]
        );

        $this->command->info('✅ Demo Tenants seeded: TechCorp (PRO) & StartupXYZ (Trial)');
    }
}
