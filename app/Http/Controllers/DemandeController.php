<?php

namespace App\Http\Controllers;

use App\Http\Resources\DemandeResource;
use App\Models\Demande;
use Illuminate\Http\Request;

class DemandeController extends Controller
{
    public function index()
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized - Admin privileges required'
            ], 403);
        }

        $demandes = Demande::all();
        return DemandeResource::collection($demandes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_materiel' => 'required|string|max:255',
            'quantite' => 'required|integer|min:1',
            'justification' => 'required|string',
        ]);

        $demande = Demande::create([
            'nom_materiel' => $validated['nom_materiel'],
            'quantite' => $validated['quantite'],
            'justification' => $validated['justification'],
            'user_id' => auth()->id(),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Demande créée avec succès',
            'data' => new DemandeResource($demande)
        ], 201);
    }

    public function show($id)
    {
        $demande = Demande::findOrFail($id);

        if (!auth()->user()->isAdmin() && auth()->id() !== $demande->user_id) {
            return response()->json([
                'message' => 'Unauthorized - You can only view your own requests'
            ], 403);
        }

        return new DemandeResource($demande);
    }

    public function update(Request $request, $id)
    {
        $demande = Demande::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected',
            'delivery_date' => 'required_if:status,accepted|date|nullable',
            'rejection_reason' => 'required_if:status,rejected|string|nullable'
        ]);

        $demande->status = $validated['status'];

        if ($validated['status'] === 'accepted') {
            $demande->delivery_date = $validated['delivery_date'];
            $demande->rejection_reason = null;
        }

        if ($validated['status'] === 'rejected') {
            $demande->rejection_reason = $validated['rejection_reason'];
            $demande->delivery_date = null;
        }

        $demande->save();

        return response()->json(['message' => 'Demande mise à jour avec succès.']);
    }

    public function destroy($id)
    {
        $demande = Demande::findOrFail($id);

        if (!auth()->user()->isAdmin() && auth()->id() !== $demande->user_id) {
            return response()->json([
                'message' => 'Unauthorized - You can only delete your own requests'
            ], 403);
        }

        $demande->delete();

        return response()->json([
            'message' => 'Demande supprimée avec succès'
        ]);
    }

    public function userDemandes()
    {
        $demandes = Demande::where('user_id', auth()->id())->get();
        return DemandeResource::collection($demandes);
    }
}
