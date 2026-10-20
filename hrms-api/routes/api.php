<?php

use Illuminate\Support\Facades\Route;

// Auth & Platform
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Platform\PlatformAuthController;
use App\Http\Controllers\Platform\TenantController;

// HR
use App\Http\Controllers\HR\EmployeeController;
use App\Http\Controllers\HR\DepartmentController;
use App\Http\Controllers\HR\WorkShiftController;
use App\Http\Controllers\HR\HolidayController;

// Attendance & Leave
use App\Http\Controllers\Attendance\AttendanceController;
use App\Http\Controllers\Attendance\LeaveController;

// Projects & Tasks
use App\Http\Controllers\Projects\ProjectController;
use App\Http\Controllers\Projects\TaskController;
use App\Http\Controllers\Projects\RequirementController;

// Finance
use App\Http\Controllers\Finance\SalaryStructureController;
use App\Http\Controllers\Finance\PayrollController;
use App\Http\Controllers\Finance\InvoiceController;
use App\Http\Controllers\Finance\ExpenseController;
use App\Http\Controllers\Finance\BudgetController;

// Clients
use App\Http\Controllers\Clients\ClientController;

// Communication & Admin
use App\Http\Controllers\Communication\ChatController;
use App\Http\Controllers\Communication\MeetingController;
use App\Http\Controllers\Admin\AssetController;
use App\Http\Controllers\Admin\SystemSettingController;
use App\Http\Controllers\Admin\AuditLogController;

/*
|--------------------------------------------------------------------------
| HRMS SaaS API Routes
|--------------------------------------------------------------------------
|
| Role Matrix:
| - SUPER_ADMIN : Root tenant owner (access all)
| - HR          : Staff, Payroll, Leaves, Attendance, Organization
| - MANAGER     : Projects, Tasks, Team Leaves & Attendance, Meetings
| - EMPLOYEE    : Personal Tasks, Attendance Clock, Leave Application, Time Logs
| - CLIENT      : Client Portal, Requirements, Invoices, Project Progress
|
*/

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Health Check
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route::get('/health', fn() => response()->json([
    'status'  => 'ok',
    'service' => 'HRMS SaaS API',
    'version' => '2.0.0',
    'time'    => now()->toIso8601String(),
]));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PLATFORM SUPER ADMIN ROUTES (guard: platform_admin)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route::prefix('platform')->group(function () {

    Route::post('/login', [PlatformAuthController::class, 'login'])->name('platform.login');

    Route::middleware('auth:platform_admin')->group(function () {
        Route::post('/logout', [PlatformAuthController::class, 'logout'])->name('platform.logout');
        Route::get('/me',     [PlatformAuthController::class, 'me'])->name('platform.me');

        // Tenant Management
        Route::prefix('tenants')->name('platform.tenants.')->group(function () {
            Route::get('/',              [TenantController::class, 'index'])->name('index');
            Route::post('/',             [TenantController::class, 'store'])->name('store');
            Route::get('/stats',         [TenantController::class, 'stats'])->name('stats');
            Route::get('/{id}',          [TenantController::class, 'show'])->name('show');
            Route::put('/{id}',          [TenantController::class, 'update'])->name('update');
            Route::delete('/{id}',       [TenantController::class, 'destroy'])->name('destroy');
            Route::patch('/{id}/status', [TenantController::class, 'updateStatus'])->name('status');
            Route::patch('/{id}/plan',   [TenantController::class, 'updatePlan'])->name('plan');
            Route::put('/{id}/modules',  [TenantController::class, 'updateModules'])->name('modules');
            Route::post('/{id}/impersonate', [TenantController::class, 'impersonate'])->name('impersonate');
        });
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TENANT USER AUTH ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout',  [AuthController::class, 'logout'])->name('logout');
        Route::get('/me',       [AuthController::class, 'me'])->name('me');
        Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
        Route::put('/password', [AuthController::class, 'changePassword'])->name('password');
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TENANT-SCOPED API ROUTES (auth:sanctum + EnsureTenantActive)
// All queries auto-filtered by tenant_id via TenantScope
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Route::middleware(['auth:sanctum', 'tenant.active'])->group(function () {

    // ── Phase 3: Core HR & Organization ───────────────────────────────
    Route::prefix('employees')->middleware('module:employees')->group(function () {
        Route::get('/',              [EmployeeController::class, 'index'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::post('/',             [EmployeeController::class, 'store'])->middleware('role:SUPER_ADMIN,HR');
        Route::get('/departments',   [EmployeeController::class, 'departments'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::get('/{id}',          [EmployeeController::class, 'show'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::put('/{id}',          [EmployeeController::class, 'update'])->middleware('role:SUPER_ADMIN,HR');
        Route::delete('/{id}',       [EmployeeController::class, 'destroy'])->middleware('role:SUPER_ADMIN,HR');
        Route::patch('/{id}/status', [EmployeeController::class, 'toggleStatus'])->middleware('role:SUPER_ADMIN,HR');
    });

    Route::prefix('departments')->group(function () {
        Route::get('/',                  [DepartmentController::class, 'index'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::get('/all',               [DepartmentController::class, 'allFlat'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::post('/',                 [DepartmentController::class, 'store'])->middleware('role:SUPER_ADMIN,HR');
        Route::get('/{id}',              [DepartmentController::class, 'show'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::put('/{id}',              [DepartmentController::class, 'update'])->middleware('role:SUPER_ADMIN,HR');
        Route::delete('/{id}',           [DepartmentController::class, 'destroy'])->middleware('role:SUPER_ADMIN,HR');
        Route::get('/{id}/designations', [DepartmentController::class, 'listDesignations'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
    });

    Route::prefix('designations')->group(function () {
        Route::post('/',        [DepartmentController::class, 'storeDesignation'])->middleware('role:SUPER_ADMIN,HR');
        Route::delete('/{id}',  [DepartmentController::class, 'destroyDesignation'])->middleware('role:SUPER_ADMIN,HR');
    });

    Route::prefix('shifts')->group(function () {
        Route::get('/',        [WorkShiftController::class, 'index'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::post('/',       [WorkShiftController::class, 'store'])->middleware('role:SUPER_ADMIN,HR');
        Route::put('/{id}',    [WorkShiftController::class, 'update'])->middleware('role:SUPER_ADMIN,HR');
        Route::delete('/{id}', [WorkShiftController::class, 'destroy'])->middleware('role:SUPER_ADMIN,HR');
    });

    Route::prefix('holidays')->group(function () {
        Route::get('/',        [HolidayController::class, 'index'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE,CLIENT');
        Route::post('/',       [HolidayController::class, 'store'])->middleware('role:SUPER_ADMIN,HR');
        Route::put('/{id}',    [HolidayController::class, 'update'])->middleware('role:SUPER_ADMIN,HR');
        Route::delete('/{id}', [HolidayController::class, 'destroy'])->middleware('role:SUPER_ADMIN,HR');
    });

    // ── Phase 3: Attendance & Leaves ─────────────────────────────────
    Route::prefix('attendance')->middleware('module:attendance')->group(function () {
        // Individual actions (All employees)
        Route::post('/clock-in',   [AttendanceController::class, 'clockIn']);
        Route::post('/clock-out',  [AttendanceController::class, 'clockOut']);
        Route::get('/today',       [AttendanceController::class, 'today']);
        Route::get('/my-history',  [AttendanceController::class, 'myHistory']);

        // Management actions (Super Admin, HR, Manager)
        Route::get('/',            [AttendanceController::class, 'index'])->middleware('role:SUPER_ADMIN,HR,MANAGER');
        Route::get('/summary',     [AttendanceController::class, 'summary'])->middleware('role:SUPER_ADMIN,HR,MANAGER');
        Route::get('/report',      [AttendanceController::class, 'report'])->middleware('role:SUPER_ADMIN,HR,MANAGER');
        Route::patch('/{id}',      [AttendanceController::class, 'update'])->middleware('role:SUPER_ADMIN,HR');
    });

    Route::prefix('leaves')->middleware('module:leave')->group(function () {
        // Individual actions
        Route::get('/types',                  [LeaveController::class, 'leaveTypes']);
        Route::get('/balance',                [LeaveController::class, 'myBalance']);
        Route::get('/requests',               [LeaveController::class, 'requests']);
        Route::post('/apply',                 [LeaveController::class, 'apply']);
        Route::delete('/requests/{id}',       [LeaveController::class, 'cancel']);

        // Approvals & Config (Super Admin, HR, Manager)
        Route::patch('/requests/{id}/status', [LeaveController::class, 'updateStatus'])->middleware('role:SUPER_ADMIN,HR,MANAGER');
        Route::post('/types',                 [LeaveController::class, 'createLeaveType'])->middleware('role:SUPER_ADMIN,HR');
        Route::put('/types/{id}',             [LeaveController::class, 'updateLeaveType'])->middleware('role:SUPER_ADMIN,HR');
    });

    // ── Phase 4: Projects, Tasks, Kanban ─────────────────────────────
    Route::prefix('projects')->middleware('module:projects')->group(function () {
        Route::get('/',                             [ProjectController::class, 'index'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE,CLIENT');
        Route::post('/',                            [ProjectController::class, 'store'])->middleware('role:SUPER_ADMIN,MANAGER');
        Route::get('/{id}',                         [ProjectController::class, 'show'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE,CLIENT');
        Route::put('/{id}',                         [ProjectController::class, 'update'])->middleware('role:SUPER_ADMIN,MANAGER');
        Route::delete('/{id}',                      [ProjectController::class, 'destroy'])->middleware('role:SUPER_ADMIN,MANAGER');
        Route::post('/{id}/milestones',             [ProjectController::class, 'storeMilestone'])->middleware('role:SUPER_ADMIN,MANAGER');
        Route::put('/milestones/{milestoneId}',     [ProjectController::class, 'updateMilestone'])->middleware('role:SUPER_ADMIN,MANAGER');
        Route::get('/{id}/requirements',            [RequirementController::class, 'index'])->middleware('role:SUPER_ADMIN,MANAGER,CLIENT,EMPLOYEE');
        Route::post('/{id}/requirements',           [RequirementController::class, 'store'])->middleware('role:SUPER_ADMIN,MANAGER,CLIENT');
    });

    Route::prefix('requirements')->middleware('module:projects')->group(function () {
        Route::put('/{id}',    [RequirementController::class, 'update'])->middleware('role:SUPER_ADMIN,MANAGER,CLIENT');
        Route::delete('/{id}', [RequirementController::class, 'destroy'])->middleware('role:SUPER_ADMIN,MANAGER');
    });

    Route::prefix('tasks')->middleware('module:tasks')->group(function () {
        Route::get('/',                   [TaskController::class, 'index'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE,CLIENT');
        Route::post('/',                  [TaskController::class, 'store'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE');
        Route::get('/{id}',               [TaskController::class, 'show'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE,CLIENT');
        Route::put('/{id}',               [TaskController::class, 'update'])->middleware('role:SUPER_ADMIN,MANAGER,EMPLOYEE');
        Route::patch('/{id}/status',      [TaskController::class, 'updateStatus'])->middleware('role:SUPER_ADMIN,MANAGER,EMPLOYEE,CLIENT');
        Route::delete('/{id}',            [TaskController::class, 'destroy'])->middleware('role:SUPER_ADMIN,MANAGER');
        Route::post('/{id}/comments',     [TaskController::class, 'storeComment'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE,CLIENT');
        Route::post('/{id}/time-logs',    [TaskController::class, 'storeTimeLog'])->middleware('role:SUPER_ADMIN,MANAGER,EMPLOYEE');
    });

    // ── Phase 5: Finance & Payroll (Strictly HR & Super Admin) ───────
    Route::prefix('salary-structures')->middleware(['module:payroll', 'role:SUPER_ADMIN,HR'])->group(function () {
        Route::get('/',        [SalaryStructureController::class, 'index']);
        Route::post('/',       [SalaryStructureController::class, 'store']);
        Route::put('/{id}',    [SalaryStructureController::class, 'update']);
        Route::delete('/{id}', [SalaryStructureController::class, 'destroy']);
    });

    Route::prefix('payroll')->middleware(['module:payroll', 'role:SUPER_ADMIN,HR'])->group(function () {
        Route::get('/',              [PayrollController::class, 'index']);
        Route::post('/generate',     [PayrollController::class, 'generate']);
        Route::get('/{id}',          [PayrollController::class, 'show']);
        Route::patch('/{id}/status', [PayrollController::class, 'updateStatus']);
    });

    Route::prefix('invoices')->middleware('module:finance')->group(function () {
        Route::get('/',              [InvoiceController::class, 'index'])->middleware('role:SUPER_ADMIN,MANAGER,HR,CLIENT');
        Route::post('/',             [InvoiceController::class, 'store'])->middleware('role:SUPER_ADMIN,MANAGER,HR');
        Route::get('/{id}',          [InvoiceController::class, 'show'])->middleware('role:SUPER_ADMIN,MANAGER,HR,CLIENT');
        Route::patch('/{id}/status', [InvoiceController::class, 'updateStatus'])->middleware('role:SUPER_ADMIN,MANAGER,HR');
        Route::delete('/{id}',       [InvoiceController::class, 'destroy'])->middleware('role:SUPER_ADMIN');
    });

    Route::prefix('expenses')->middleware('module:finance')->group(function () {
        Route::get('/',              [ExpenseController::class, 'index'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE');
        Route::post('/',             [ExpenseController::class, 'store'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE');
        Route::patch('/{id}/status', [ExpenseController::class, 'updateStatus'])->middleware('role:SUPER_ADMIN,HR,MANAGER');
        Route::delete('/{id}',       [ExpenseController::class, 'destroy'])->middleware('role:SUPER_ADMIN,HR');
    });

    Route::prefix('budgets')->middleware(['module:finance', 'role:SUPER_ADMIN,MANAGER,HR'])->group(function () {
        Route::get('/',        [BudgetController::class, 'index']);
        Route::post('/',       [BudgetController::class, 'store']);
        Route::put('/{id}',    [BudgetController::class, 'update']);
        Route::delete('/{id}', [BudgetController::class, 'destroy']);
    });

    // ── Phase 6: Clients & CRM ────────────────────────────────────────
    Route::prefix('clients')->middleware(['module:clients', 'role:SUPER_ADMIN,MANAGER,HR'])->group(function () {
        Route::get('/',        [ClientController::class, 'index']);
        Route::post('/',       [ClientController::class, 'store']);
        Route::get('/{id}',    [ClientController::class, 'show']);
        Route::put('/{id}',    [ClientController::class, 'update']);
        Route::delete('/{id}', [ClientController::class, 'destroy']);
    });

    // ── Phase 7: Team Communication & Company Admin ───────────────────
    Route::prefix('chat')->middleware('module:chat')->group(function () {
        Route::get('/channels',                  [ChatController::class, 'channels'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE');
        Route::post('/channels',                 [ChatController::class, 'createChannel'])->middleware('role:SUPER_ADMIN,MANAGER,HR');
        Route::get('/channels/{id}/messages',    [ChatController::class, 'messages'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE');
        Route::post('/channels/{id}/messages',   [ChatController::class, 'sendMessage'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE');
        Route::post('/messages/{id}/react',      [ChatController::class, 'react'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE');
    });

    Route::prefix('meetings')->middleware('module:meetings')->group(function () {
        Route::get('/',                     [MeetingController::class, 'index'])->middleware('role:SUPER_ADMIN,MANAGER,HR,EMPLOYEE,CLIENT');
        Route::post('/',                    [MeetingController::class, 'store'])->middleware('role:SUPER_ADMIN,MANAGER,HR');
        Route::patch('/{id}/status',        [MeetingController::class, 'updateStatus'])->middleware('role:SUPER_ADMIN,MANAGER,HR');
        Route::put('/{id}/ai-notes',        [MeetingController::class, 'updateAiNotes'])->middleware('role:SUPER_ADMIN,MANAGER');
        Route::delete('/{id}',              [MeetingController::class, 'destroy'])->middleware('role:SUPER_ADMIN,MANAGER');
    });

    Route::prefix('assets')->group(function () {
        Route::get('/',        [AssetController::class, 'index'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::post('/',       [AssetController::class, 'store'])->middleware('role:SUPER_ADMIN,HR');
        Route::put('/{id}',    [AssetController::class, 'update'])->middleware('role:SUPER_ADMIN,HR');
        Route::delete('/{id}', [AssetController::class, 'destroy'])->middleware('role:SUPER_ADMIN,HR');
    });

    Route::prefix('settings')->group(function () {
        Route::get('/',        [SystemSettingController::class, 'index'])->middleware('role:SUPER_ADMIN,HR,MANAGER,EMPLOYEE');
        Route::post('/bulk',   [SystemSettingController::class, 'updateBulk'])->middleware('role:SUPER_ADMIN');
    });

    Route::prefix('audit-logs')->group(function () {
        Route::get('/',        [AuditLogController::class, 'index'])->middleware('role:SUPER_ADMIN');
    });
});
