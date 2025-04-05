<?php

namespace App\Http\Controllers;

use App\Http\Resources\StockResource;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized - Admin privileges required'
            ], 403);
        }

        $stocks = Stock::orderBy('created_at', 'desc')->paginate(10);

        return StockResource::collection($stocks);
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
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized - Admin privileges required'
            ], 403);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $stock = Stock::create($validatedData);

        return response()->json([
            'message' => 'Stock created successfully',
            'data' => $stock
        ], 201);
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
        
        // Verify the authenticated user is an admin (or has stock deletion permissions)
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized - Admin privileges required'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);
    
        DB::transaction(function () use ($id, $validated) {
            $stock = Stock::findOrFail($id);
            
            $stock->name = $validated['name'];
            $stock->quantity = $validated['quantity'];
            $stock->description = $validated['description'];
            
            $stock->save();
            
        });
            
        // Return the updated stock
        return response()->json([
            'message' => 'Stock updated successfully',
            'data' => new StockResource(Stock::find($id))
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
        // Find the stock or fail with 404
        $stock = Stock::findOrFail($id);

        // Verify the authenticated user is an admin (or has stock deletion permissions)
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized - Admin privileges required'
            ], 403);
        }

        // Use transaction for data integrity
        DB::transaction(function () use ($stock) {
            $stock->delete();
        });

        return response()->json([
            'message' => 'Stock deleted successfully'
        ], 204); // 204 No Content
    }
}
