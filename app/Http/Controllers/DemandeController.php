<?php

namespace App\Http\Controllers;

use App\Http\Resources\DemandeResource;
use App\Models\Demande;
use Illuminate\Http\Request;

class DemandeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (!auth()->user()->isAdmin()) 
        {
            return response()->json([
                'message' => 'Unauthorized - Admin privileges required'
            ], 403);
        }
        
        $demandes = Demande::orderBy('created_at', 'desc') 
                      ->paginate(10);
    
        return DemandeResource::collection($demandes);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        
        if (!auth()->user()->isAdmin()) 
        {
            return response()->json([
                'message' => 'Unauthorized - Admin privileges required'
            ], 403);
        }

        // Validate the request data
        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,rejected', // matches your enum values
        ]);

        // Find the demande by ID
        $demande = Demande::findOrFail($id);

        // Update the status
        $demande->update([
            'status' => $validated['status']
        ]);

        // Return a response (JSON recommended for APIs)
        return response()->json([
            'message' => 'Demande status updated successfully',
            'data' => new DemandeResource($demande) // If you have a Resource
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
