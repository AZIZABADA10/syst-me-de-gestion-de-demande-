<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demande extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // app/Models/Demande.php
    protected $fillable = [
        'nom_materiel',
        'quantite',
        'justification',
        'user_id',
        'status',
        'delivery_date',
        'rejection_reason'
    ];


}
