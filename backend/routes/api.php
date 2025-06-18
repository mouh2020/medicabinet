<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\DoctorAuthController;
use App\Http\Controllers\Api\V1\Auth\AssistantAuthController;
use App\Http\Controllers\Api\V1\Auth\PatientAuthController;

// Doctor Controllers
use App\Http\Controllers\Api\V1\Doctor\AppointmentController as DoctorAppointmentController;
use App\Http\Controllers\Api\V1\Doctor\ConsultationController as DoctorConsultationController;
use App\Http\Controllers\Api\V1\Doctor\PrescriptionController as DoctorPrescriptionController;
use App\Http\Controllers\Api\V1\Doctor\AssistantController as DoctorAssistantController;
use App\Http\Controllers\Api\V1\Doctor\PatientController as DoctorPatientController;

// Assistant Controllers
use App\Http\Controllers\Api\V1\Assistant\AppointmentController as AssistantAppointmentController;
use App\Http\Controllers\Api\V1\Assistant\PatientController as AssistantPatientController;

// Patient Controllers
use App\Http\Controllers\Api\V1\Patient\AppointmentController as PatientAppointmentController;
use App\Http\Controllers\Api\V1\Patient\ConsultationController as PatientConsultationController;
use App\Http\Controllers\Api\V1\Patient\PrescriptionController as PatientPrescriptionController;

Route::prefix('v1')->group(function () {

    // 🟢 Public Auth Routes
    Route::prefix('doctor')->group(function () {
        Route::post('login', [DoctorAuthController::class, 'login']);
        Route::post('register', [DoctorAuthController::class, 'register']);
    });

    Route::prefix('assistant')->group(function () {
        Route::post('login', [AssistantAuthController::class, 'login']);
    });

    Route::prefix('patient')->group(function () {
        Route::post('login', [PatientAuthController::class, 'login']);
        Route::post('register', [PatientAuthController::class, 'register']);
    });

    // 🔒 Protected Routes

    // 👨‍⚕️ Doctor Routes
    Route::prefix('doctor')->middleware(['auth:sanctum', 'doctor'])->group(function () {
        Route::post('logout', [DoctorAuthController::class, 'logout']);
        Route::apiResource('appointments', DoctorAppointmentController::class)->only(['index', 'update', 'destroy']);
        Route::apiResource('consultations', DoctorConsultationController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('prescriptions', DoctorPrescriptionController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('assistants', DoctorAssistantController::class);
        Route::apiResource('patients', DoctorPatientController::class);
    });

    // 👩‍⚕️ Assistant Routes
    Route::prefix('assistant')->middleware(['auth:sanctum', 'assistant'])->group(function () {
        Route::post('logout', [AssistantAuthController::class, 'logout']);
        Route::apiResource('appointments', AssistantAppointmentController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('patients', AssistantPatientController::class);
    });

    // 🧑‍🍼 Patient Routes
    Route::prefix('patient')->middleware(['auth:sanctum', 'patient'])->group(function () {
        Route::post('logout', [PatientAuthController::class, 'logout']);
        Route::apiResource('appointments', PatientAppointmentController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('consultations', [PatientConsultationController::class, 'index']);
        Route::get('prescriptions', [PatientPrescriptionController::class, 'index']);
    });

});
