<?php
namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\Assistant;
use Illuminate\Http\Request;

class AssistantAuthController extends Controller
{
    public function login(Request $request)
    {
        $assistant = Assistant::where('email', $request->email)->first();

        if (! $assistant || $assistant->password !== $request->password) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $assistant->createToken('assistant-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'assistant' => $assistant
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

}

