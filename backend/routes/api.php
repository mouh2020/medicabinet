<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth Controllers
use App\Http\Controllers\Api\V1\Auth\DoctorAuthController;
use App\Http\Controllers\Api\V1\Auth\AssistantAuthController;
use App\Http\Controllers\Api\V1\Auth\PatientAuthController;

// Appointment Controllers
use App\Http\Controllers\Api\V1\Patient\AppointmentController as PatientAppointmentController;
use App\Http\Controllers\Api\V1\Doctor\AppointmentController as DoctorAppointmentController;
use App\Http\Controllers\Api\V1\Assistant\AppointmentController as AssistantAppointmentController;

// Consultation & Prescription Controllers
use App\Http\Controllers\Api\V1\Doctor\ConsultationController as DoctorConsultationController;
use App\Http\Controllers\Api\V1\Doctor\PrescriptionController as DoctorPrescriptionController;
use App\Http\Controllers\Api\V1\Patient\ConsultationController as PatientConsultationController;
use App\Http\Controllers\Api\V1\Patient\PrescriptionController as PatientPrescriptionController;

// Doctor Manages Assistants & Patients
use App\Http\Controllers\Api\V1\Doctor\AssistantController as DoctorAssistantController;
use App\Http\Controllers\Api\V1\Doctor\PatientController as DoctorPatientController;

// Assistant Manages Patients
use App\Http\Controllers\Api\V1\Assistant\PatientController as AssistantPatientController;

Route::prefix('v1')->group(function () {

    // 🔐 Public Auth Routes
    Route::post('/doctor/login', [DoctorAuthController::class, 'login']);
    Route::post('/doctor/register', [DoctorAuthController::class, 'register']);
    Route::post('/assistant/login', [AssistantAuthController::class, 'login']);
    Route::post('/patient/login', [PatientAuthController::class, 'login']);
    Route::post('/patient/register', [PatientAuthController::class, 'register']);
    

    // 🔒 Logout Routes (Protected)
    Route::middleware(['auth:sanctum', 'doctor'])->post('/doctor/logout', [DoctorAuthController::class, 'logout']);
    Route::middleware(['auth:sanctum', 'assistant'])->post('/assistant/logout', [AssistantAuthController::class, 'logout']);
    Route::middleware(['auth:sanctum', 'patient'])->post('/patient/logout', [PatientAuthController::class, 'logout']);

    // 👨‍⚕️ Doctor Routes
    Route::middleware(['auth:sanctum', 'doctor'])->group(function () {
        Route::apiResource('appointments', DoctorAppointmentController::class)->only(['index', 'update', 'destroy']);
        Route::apiResource('consultations', DoctorConsultationController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('prescriptions', DoctorPrescriptionController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('assistants', DoctorAssistantController::class);
        Route::apiResource('patients', DoctorPatientController::class);
    });

    // 👩‍⚕️ Assistant Routes
    Route::middleware(['auth:sanctum', 'assistant'])->group(function () {
        Route::apiResource('appointments', AssistantAppointmentController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('patients', AssistantPatientController::class);
    });

    // 🧑‍🍼 Patient Routes
    Route::middleware(['auth:sanctum', 'patient'])->group(function () {
        Route::apiResource('appointments', PatientAppointmentController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('/consultations', [PatientConsultationController::class, 'index']);
        Route::get('/prescriptions', [PatientPrescriptionController::class, 'index']);
    });

});
