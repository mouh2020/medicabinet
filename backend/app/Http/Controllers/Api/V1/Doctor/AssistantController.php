<?php

namespace App\Http\Controllers\Api\V1\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Assistant;

class AssistantController extends Controller
{
    // View all assistants
    public function index()
    {
        $assistants = Assistant::latest()->get();
        return response()->json(['assistants' => $assistants]);
    }

    // View single assistant
    public function show($id)
    {
        $assistant = Assistant::find($id);
        if (! $assistant) {
            return response()->json(['error' => 'Assistant not found'], 404);
        }
        return response()->json(['assistant' => $assistant]);
    }

    // Add assistant
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string',
            'birthday' => 'nullable|date',
            'address' => 'nullable|string',
            'email' => 'required|email|unique:assistants,email',
            'password' => 'required|string|min:4'
        ]);

        $assistant = Assistant::create($request->only([
            'full_name', 'phone', 'birthday', 'address', 'email', 'password'
        ]));

        return response()->json(['message' => 'Assistant created', 'assistant' => $assistant], 201);
    }

    // Update assistant
    public function update(Request $request, $id)
    {
        $assistant = Assistant::find($id);
        if (! $assistant) {
            return response()->json(['error' => 'Assistant not found'], 404);
        }

        $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string',
            'birthday' => 'nullable|date',
            'address' => 'nullable|string',
            'email' => 'sometimes|email|unique:assistants,email,' . $id,
            'password' => 'sometimes|string|min:4'
        ]);

        $assistant->update($request->only([
            'full_name', 'phone', 'birthday', 'address', 'email', 'password'
        ]));

        return response()->json(['message' => 'Assistant updated', 'assistant' => $assistant]);
    }

    // Delete assistant
    public function destroy($id)
    {
        $assistant = Assistant::find($id);
        if (! $assistant) {
            return response()->json(['error' => 'Assistant not found'], 404);
        }

        $assistant->delete();

        return response()->json(['message' => 'Assistant deleted']);
    }
}
