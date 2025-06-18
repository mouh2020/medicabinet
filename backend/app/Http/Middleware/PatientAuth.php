<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PatientAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth('sanctum')->user();

        if (! $user || ! $user instanceof \App\Models\Patient) {
            return response()->json(['error' => 'Unauthorized - Patient only'], 403);
        }

        return $next($request);
    }
}
