<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return response()->json(Task::where('user_id', Auth::id())->get());
    }

    public function getAllTasks()
    {
        return response()->json(Task::all());
    }

    public function store(Request $request)
    {
        
    
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:todo,in_progress,done',
        ]);
    
        $validatedData['user_id'] = Auth::id();
        $task = Task::create($validatedData);
    
        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
{
    $task = Task::where('user_id', Auth::id())->findOrFail($id);

    Log::info('Update Task Request:', $request->all()); // Debugging

    $validatedData = $request->validate([
        'title' => 'sometimes|required|string|max:255',
        'description' => 'nullable|string',
        'status' => 'sometimes|required|string|in:todo,in_progress,done',
    ]);

    // 🔹 Ensure 'status' exists before modifying it
    if (isset($validatedData['status'])) {
        $validatedData['status'] = str_replace('-', '_', $validatedData['status']); 
    }

    Log::info('Before update:', $task->toArray());
    $task->update($validatedData);
    Log::info('After update:', $task->toArray());

    return response()->json($task);
}

    

    public function destroy($id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);
        $task->delete();

        return response()->json(null, 204);
    }

    public function move(Request $request, $id)
    {
        $task = Task::where('user_id', Auth::id())->findOrFail($id);

        $validatedData = $request->validate([
            'status' => 'required|string|in:todo,in_progress,done',
        ]);

        $task->status = $validatedData['status'];
        $task->save();

        return response()->json($task);
    }
}
