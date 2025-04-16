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
       
        $demandes = Demande::all();
   
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
        // Valider les données de la requête
        $validated = $request->validate([
            'nom_materiel' => 'required|string|max:255',
            'quantite' => 'required|integer|min:1',
            'justification' => 'required|string',
            // Ajoutez d'autres champs si nécessaire
        ]);

        // Créer une nouvelle demande
        $demande = Demande::create([
            'nom_materiel' => $validated['nom_materiel'],
            'quantite' => $validated['quantite'],
            'justification' => $validated['justification'],
            'user_id' => auth()->id(), // Associer la demande à l'utilisateur connecté
            'status' => 'pending', // Statut par défaut
            // Ajoutez d'autres champs si nécessaire
        ]);

        // Retourner une réponse
        return response()->json([
            'message' => 'Demande créée avec succès',
            'data' => new DemandeResource($demande)
        ], 201); // 201 = Created
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $demande = Demande::findOrFail($id);
        
        // Vérifier si l'utilisateur est autorisé à voir cette demande
        if (!auth()->user()->isAdmin() && auth()->id() !== $demande->user_id) {
            return response()->json([
                'message' => 'Unauthorized - You can only view your own requests'
            ], 403);
        }
        
        return response()->json([
            'data' => Demande::all()
        ]);
        
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
    $demande = Demande::findOrFail($id);

    $validated = $request->validate([
        'status' => 'required|in:accepted,rejected',
        'delivery_date' => 'required_if:status,accepted|date|nullable',
        'rejection_reason' => 'required_if:status,rejected|string|nullable'
    ]);

    $demande->status = $validated['status'];

    if ($validated['status'] === 'accepted') {
        $demande->delivery_date = $validated['delivery_date'];
        $demande->rejection_reason = null; // Reset
    }

    if ($validated['status'] === 'rejected') {
        $demande->rejection_reason = $validated['rejection_reason'];
        $demande->delivery_date = null; // Reset
    }

    $demande->save();

    return response()->json(['message' => 'Demande mise à jour avec succès.']);
}


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $demande = Demande::findOrFail($id);
        
        // Vérifier si l'utilisateur est autorisé à supprimer cette demande
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
    
    /**
     * Get the requests of the authenticated user
     *
     * @return \Illuminate\Http\Response
     */
    public function userDemandes()
    {
        $demandes = Demande::where('user_id', auth()->id())->get();
        
        return DemandeResource::collection($demandes);
    }
}