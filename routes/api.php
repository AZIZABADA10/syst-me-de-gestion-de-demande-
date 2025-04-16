<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\EmployeeController; 
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Routes existantes
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::apiResource('/stocks', StockController::class);
    Route::apiResource('/employees', EmployeeController::class);

    // Routes pour les demandes de matériel
    Route::apiResource('/demandes', DemandeController::class);
    Route::get('/material-requests', [DemandeController::class, 'index']);
    Route::post('/material-requests', [DemandeController::class, 'store']);
    Route::get('/material-requests/{id}', [DemandeController::class, 'show']);
    Route::put('/material-requests/{id}', [DemandeController::class, 'update']);
    Route::delete('/material-requests/{id}', [DemandeController::class, 'destroy']);

    // Route pour les demandes de l'utilisateur connecté
    Route::get('/user/material-requests', [DemandeController::class, 'userDemandes']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});

// Routes d'authentification
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Route pour le cookie CSRF
Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});
