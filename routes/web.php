<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CampaignController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
    Route::post('/campaigns/parse', [CampaignController::class, 'parse'])->name('campaigns.parse');
    Route::get('/campaigns/review', [CampaignController::class, 'review'])->name('campaigns.review');
    Route::post('/campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
});

require __DIR__.'/settings.php';

Route::get('/render/flyer/{campaign}', [CampaignController::class, 'renderFlyer'])->name('render.flyer');
