<?php

namespace App\Http\Controllers;

use App\Http\Resources\OfficeResource;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class OfficeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Office::query();

        // Apply search query
        if ($request->filled('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            $query->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%']);
        }

        $offices = $query->orderBy('created_at', 'desc')->paginate(10);
        $total = $query->count(); // Get the total count of offices

        if ($offices) {
            return response()->json([
                'status' => 200,
                'offices' => $offices,
                'total' => $total,
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to fetch offices',
            ], 500);
        }
    }

    public function alloffice()
    {
        $offices = Office::all();
        return response()->json([
            'status' => 200,
            'offices' => $offices,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);
    
        $office = new Office();
        $office->name = $validated['name'];
    
        if ($office->save()) {
            return response()->json([
                'status' => 'success', 
                'message' => 'Office created successfully', 
                'data' => new OfficeResource($office)
            ], 201);
        } else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to create office'
            ], 500);
        }

        // Optionally, you can return a response or redirect to a specific route
        // return response()->json(['message' => 'Office created successfully']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Office $office, Request $request)
    {
        $user = $request->user();

        if (!$office) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Office not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success', 
            'data' => new OfficeResource($office)]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $office = Office::findOrFail($id);
        
        // Perform the update logic

        if ($office->save()) {
            return response()->json([
                'status' => 'success', 
                'message' => 'Office updated successfully', 
                'data' => $office], 200);
        } else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to update office'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $office = Office::findOrFail($id);

            // Delete the office and store Auth::user()->id in updated_by field
            $office->deleteWithHistory(Auth::user()->id);

            return response()->json([
                'status' => 'success', 
                'message' => 'Office deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to delete office'
            ], 500);
        }
    }
}
