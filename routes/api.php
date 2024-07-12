<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MobilityController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Contracts\Permission;
use Spatie\Permission\Contracts\Role;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // Route::apiResource('form', FormController::class);
    
    // ADMIN ROUTES
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [MobilityController::class, 'dashboard']);
        
        Route::apiResource('users', AdminController::class);
        Route::get('/users', [AdminController::class, 'index']);
        Route::get('/created-by-users', [AdminController::class, 'alluser']);
        Route::post('/users/add-admin', [AdminController::class, 'store']);
        Route::get('/users/view/{userId}', [AdminController::class, 'show']);
        Route::post('/users/update/{userId}', [AdminController::class, 'update']);
        Route::delete('/users/{userId}', [AdminController::class, 'destroy']);
        Route::get('/profile/{userId}',[AuthController::class, 'show']);
        Route::post('/update/{userId}',[AuthController::class, 'updateProfile']);
        Route::get('/{userId}/status',[AuthController::class, 'getStatus']);

        Route::apiResource('offices', OfficeController::class);
        Route::get('/office', [OfficeController::class, 'alloffice']);
        Route::get('/offices', [OfficeController::class, 'index']);
        Route::post('/offices/add-office', [OfficeController::class, 'store']);
        Route::delete('/offices/{officeId}', [OfficeController::class, 'destroy']);

        Route::apiResource('forms', FormController::class);
        Route::get('/forms', [FormController::class, 'index']);
        Route::post('/forms/add-form', [FormController::class, 'storeFormModule']);
        Route::post('/forms/update-form/{formId}', [FormController::class, 'updateFormModule']);
        Route::get('/forms/view/{formId}', [FormController::class, 'show']);
        Route::get('/forms/view/{formId}/files', [FormController::class, 'showFiles']);
        Route::post('/forms/add-file', [FormController::class, 'storeFormFile']);
        Route::delete('/forms/view/delete/{fileId}', [FormController::class, 'deleteFile']);
        Route::delete('/forms/{formId}', [FormController::class, 'destroy']);

        // Route::apiResource('roles-permissions', RoleController::class);
        Route::get('/roles', [RoleController::class, 'allrole']);
        // // Route::apiResource('roles-permissions', PermissionController::class);
        // Route::get('/roles-permissions', [RoleController::class, 'index']);
        // Route::post('/roles-permissions/add-permissions', [PermissionController::class, 'store']);
        // Route::delete('/roles-permissions/{roleId}', [RoleController::class, 'destroy']);
        // Route::delete('/roles-permissions/{permissionId}', [PermissionController::class, 'destroy']);

        Route::get('/categories', [MobilityController::class, 'index']);
        Route::get('/category', [MobilityController::class, 'allcategories']);
        Route::get('/categories/{categoryId}', [MobilityController::class, 'show']);
        Route::post('/categories/update/{categoryId}',[MobilityController::class, 'update']);
        Route::delete('/categories/{categoryId}/users/{userId}', [MobilityController::class, 'removeUser']);

        Route::apiResource('requests', MobilityController::class);
        Route::get('/all-users', [MobilityController::class, 'allusers']);
        Route::post('/category-auth', [MobilityController::class, 'authUpdate']);

        Route::get('/faculty-admin-staff-mobility', [MobilityController::class, 'indexFASM']);
        Route::post('/faculty-admin-staff-mobility/add-log-request', [MobilityController::class, 'storeFASM']);
        Route::get('/faculty-admin-staff-mobility/view/{logId}', [MobilityController::class, 'showFASM']);
        Route::get('/faculty-admin-staff-mobility/view/{logId}/history', [MobilityController::class, 'showFASMHistory']);
        Route::post('/faculty-admin-staff-mobility/update/{logId}', [MobilityController::class, 'updateFASM']);
        Route::get('/faculty-admin-staff-mobility/view/{logId}/files', [MobilityController::class, 'showFilesFASM']);
        Route::post('/faculty-admin-staff-mobility/add-file', [MobilityController::class, 'storeFormFileFASM']);
        Route::delete('/faculty-admin-staff-mobility/view/delete/{fileId}', [MobilityController::class, 'deleteFileFASM']);
        Route::delete('/faculty-admin-staff-mobility/{formId}', [MobilityController::class, 'destroyFASM']);

        Route::get('/student-international-mobility', [MobilityController::class, 'indexSIS']);
        Route::post('/student-international-mobility/add-log-request', [MobilityController::class, 'storeSIS']);
        Route::get('/student-international-mobility/view/{logId}', [MobilityController::class, 'showSIS']);
        Route::get('/student-international-mobility/view/{logId}/history', [MobilityController::class, 'showSISHistory']);
        Route::post('/student-international-mobility/update/{logId}', [MobilityController::class, 'updateSIS']);
        Route::get('/student-international-mobility/view/{logId}/files', [MobilityController::class, 'showFilesSIS']);
        Route::post('/student-international-mobility/add-file', [MobilityController::class, 'storeFormFileSIS']);
        Route::delete('/student-international-mobility/view/delete/{fileId}', [MobilityController::class, 'deleteFileSIS']);
        Route::delete('/student-international-mobility/{formId}', [MobilityController::class, 'destroySIS']);

        Route::get('/internal-office-process-mobility', [MobilityController::class, 'indexIOP']);
        Route::post('/internal-office-process-mobility/add-log-request', [MobilityController::class, 'storeIOP']);
        Route::get('/internal-office-process-mobility/view/{logId}', [MobilityController::class, 'showIOP']);
        Route::get('/internal-office-process-mobility/view/{logId}/history', [MobilityController::class, 'showIOPHistory']);
        Route::post('/internal-office-process-mobility/update/{logId}', [MobilityController::class, 'updateIOP']);
        Route::get('/internal-office-process-mobility/view/{logId}/files', [MobilityController::class, 'showFilesIOP']);
        Route::post('/internal-office-process-mobility/add-file', [MobilityController::class, 'storeFormFileIOP']);
        Route::delete('/internal-office-process-mobility/view/delete/{fileId}', [MobilityController::class, 'deleteFileIOP']);
        Route::delete('/internal-office-process-mobility/{formId}', [MobilityController::class, 'destroyIOP']);

        Route::get('/project-office-management-mobility', [MobilityController::class, 'indexPROM']);
        Route::post('/project-office-management-mobility/add-log-request', [MobilityController::class, 'storePROM']);
        Route::get('/project-office-management-mobility/view/{logId}', [MobilityController::class, 'showPROM']);
        Route::get('/project-office-management-mobility/view/{logId}/history', [MobilityController::class, 'showPROMHistory']);
        Route::post('/project-office-management-mobility/update/{logId}', [MobilityController::class, 'updatePROM']);
        Route::get('/project-office-management-mobility/view/{logId}/files', [MobilityController::class, 'showFilesPROM']);
        Route::post('/project-office-management-mobility/add-file', [MobilityController::class, 'storeFormFilePROM']);
        Route::delete('/project-office-management-mobility/view/delete/{fileId}', [MobilityController::class, 'deleteFilePROM']);
        Route::delete('/project-office-management-mobility/{formId}', [MobilityController::class, 'destroyPROM']);
        
        Route::get('/notifications', [AdminController::class, 'indexNotification']);
        Route::put('/notifications/{notifId}', [AdminController::class, 'markNotification']);
    });
    // STAFF ROUTES
    Route::middleware('role:user')->prefix('user')->group(function () {
        Route::get('/dashboard', [MobilityController::class, 'dashboard']);
        
        Route::get('/profile/{userId}',[AuthController::class, 'show']);
        Route::post('/update/{userId}',[AuthController::class, 'updateProfile']);
        Route::get('/{userId}/status',[AuthController::class, 'getStatus']);

        Route::apiResource('offices', OfficeController::class);
        Route::get('/office', [OfficeController::class, 'alloffice']);
        Route::get('/offices', [OfficeController::class, 'index']);
        Route::post('/offices/add-office', [OfficeController::class, 'store']);
        Route::delete('/offices/{officeId}', [OfficeController::class, 'destroy']);

        Route::apiResource('forms', FormController::class);
        Route::get('/forms', [FormController::class, 'index']);
        Route::post('/forms/add-form', [FormController::class, 'storeFormModule']);
        Route::post('/forms/update-form/{formId}', [FormController::class, 'updateFormModule']);
        Route::get('/forms/view/{formId}', [FormController::class, 'show']);
        Route::get('/forms/view/{formId}/files', [FormController::class, 'showFiles']);
        Route::post('/forms/add-file', [FormController::class, 'storeFormFile']);
        Route::delete('/forms/view/delete/{fileId}', [FormController::class, 'deleteFile']);
        Route::delete('/forms/{formId}', [FormController::class, 'destroy']);

        Route::apiResource('requests', MobilityController::class);
        Route::post('/category-auth', [MobilityController::class, 'authUpdate']);
        
        Route::get('/categories', [MobilityController::class, 'index']);
        Route::get('/categories/{categoryId}', [MobilityController::class, 'show']);
        Route::post('/categories/update/{categoryId}',[MobilityController::class, 'update']);

        Route::apiResource('requests', MobilityController::class);
        Route::post('/category-auth', [MobilityController::class, 'authUpdate']);

        Route::get('/faculty-admin-staff-mobility', [MobilityController::class, 'indexFASM']);
        Route::post('/faculty-admin-staff-mobility/add-log-request', [MobilityController::class, 'storeFASM']);
        Route::get('/faculty-admin-staff-mobility/view/{logId}', [MobilityController::class, 'showFASM']);
        Route::get('/faculty-admin-staff-mobility/view/{logId}/history', [MobilityController::class, 'showFASMHistory']);
        Route::post('/faculty-admin-staff-mobility/update/{logId}', [MobilityController::class, 'updateFASM']);
        Route::get('/faculty-admin-staff-mobility/view/{logId}/files', [MobilityController::class, 'showFilesFASM']);
        Route::post('/faculty-admin-staff-mobility/add-file', [MobilityController::class, 'storeFormFileFASM']);
        Route::delete('/faculty-admin-staff-mobility/view/delete/{fileId}', [MobilityController::class, 'deleteFileFASM']);
        Route::delete('/faculty-admin-staff-mobility/{formId}', [MobilityController::class, 'destroyFASM']);

        Route::get('/student-international-mobility', [MobilityController::class, 'indexSIS']);
        Route::post('/student-international-mobility/add-log-request', [MobilityController::class, 'storeSIS']);
        Route::get('/student-international-mobility/view/{logId}', [MobilityController::class, 'showSIS']);
        Route::get('/student-international-mobility/view/{logId}/history', [MobilityController::class, 'showSISHistory']);
        Route::post('/student-international-mobility/update/{logId}', [MobilityController::class, 'updateSIS']);
        Route::get('/student-international-mobility/view/{logId}/files', [MobilityController::class, 'showFilesSIS']);
        Route::post('/student-international-mobility/add-file', [MobilityController::class, 'storeFormFileSIS']);
        Route::delete('/student-international-mobility/view/delete/{fileId}', [MobilityController::class, 'deleteFileSIS']);
        Route::delete('/student-international-mobility/{formId}', [MobilityController::class, 'destroySIS']);

        Route::get('/internal-office-process-mobility', [MobilityController::class, 'indexIOP']);
        Route::post('/internal-office-process-mobility/add-log-request', [MobilityController::class, 'storeIOP']);
        Route::get('/internal-office-process-mobility/view/{logId}', [MobilityController::class, 'showIOP']);
        Route::get('/internal-office-process-mobility/view/{logId}/history', [MobilityController::class, 'showIOPHistory']);
        Route::post('/internal-office-process-mobility/update/{logId}', [MobilityController::class, 'updateIOP']);
        Route::get('/internal-office-process-mobility/view/{logId}/files', [MobilityController::class, 'showFilesIOP']);
        Route::post('/internal-office-process-mobility/add-file', [MobilityController::class, 'storeFormFileIOP']);
        Route::delete('/internal-office-process-mobility/view/delete/{fileId}', [MobilityController::class, 'deleteFileIOP']);
        Route::delete('/internal-office-process-mobility/{formId}', [MobilityController::class, 'destroyIOP']);

        Route::get('/project-office-management-mobility', [MobilityController::class, 'indexPROM']);
        Route::post('/project-office-management-mobility/add-log-request', [MobilityController::class, 'storePROM']);
        Route::get('/project-office-management-mobility/view/{logId}', [MobilityController::class, 'showPROM']);
        Route::get('/project-office-management-mobility/view/{logId}/history', [MobilityController::class, 'showPROMHistory']);
        Route::post('/project-office-management-mobility/update/{logId}', [MobilityController::class, 'updatePROM']);
        Route::get('/project-office-management-mobility/view/{logId}/files', [MobilityController::class, 'showFilesPROM']);
        Route::post('/project-office-management-mobility/add-file', [MobilityController::class, 'storeFormFilePROM']);
        Route::delete('/project-office-management-mobility/view/delete/{fileId}', [MobilityController::class, 'deleteFilePROM']);
        Route::delete('/project-office-management-mobility/{formId}', [MobilityController::class, 'destroyPROM']);

        Route::get('/notifications', [AdminController::class, 'indexNotification']);
        Route::put('/notifications/{notifId}', [AdminController::class, 'markNotification']);
    });
    // GUEST ROUTES
    // Route::middleware('role:guest')->prefix('guest')->group(function () {
    //     Route::get('/profile/{userId}',[AuthController::class, 'show']);
    //     Route::post('/update/{userId}',[AuthController::class, 'updateProfile']);
    //     Route::get('/dashboard', [MobilityController::class, 'dashboard']);
    // });
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

//Public
Route::get('/download-forms', [FormController::class, 'indexPublic']);
