<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AssistantAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth('sanctum')->user();

        if (! $user || ! $user instanceof \App\Models\Assistant) {
            return response()->json(['error' => 'Unauthorized - Assistant only'], 403);
        }

        return $next($request);
    }
}
