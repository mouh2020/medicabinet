<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Prescription;

class PrescriptionController extends Controller
{
    public function index()
    {
        $prescriptions = Prescription::where('patient_id', Auth::id())->latest()->get();

        return response()->json(['prescriptions' => $prescriptions]);
    }
}
