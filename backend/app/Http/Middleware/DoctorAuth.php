<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DoctorAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth('sanctum')->user();

        if (! $user || ! $user instanceof \App\Models\Doctor) {
            return response()->json(['error' => 'Unauthorized - Doctor only'], 403);
        }

        return $next($request);
    }
}
