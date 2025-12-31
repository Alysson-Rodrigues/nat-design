<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignItem;
use App\Models\Product;
use App\Services\ImageGenerator;
use App\Services\OfferParser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function create()
    {
        return Inertia::render('Campaigns/Create');
    }

    public function parse(Request $request, OfferParser $parser)
    {
        $request->validate(['text' => 'required|string']);
        
        $parsed = $parser->parse($request->text);
        
        session(['parsed_campaign' => $parsed]);

        return to_route('campaigns.review');
    }

    public function review()
    {
        $parsed = session('parsed_campaign');

        if (!$parsed) {
            return to_route('campaigns.create');
        }

        return Inertia::render('Campaigns/Edit', [
            'initialItems' => $parsed['items'],
            'header' => $parsed['header'],
        ]);
    }

    public function store(Request $request, ImageGenerator $generator)
    {
        $request->validate([
            'name' => 'required|string',
            'validity_text' => 'required|string',
            'items' => 'required|array',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
        ]);

        $campaign = Campaign::create([
            'name' => $request->name,
            'validity_text' => $request->validity_text,
            'theme_color_hex' => $request->theme_color_hex ?? '#0f4c18',
            // Handle theme images uploads if present
        ]);
        
        if ($request->hasFile('theme_hero')) {
            $path = $request->file('theme_hero')->store('themes', 'public');
            $campaign->update(['theme_hero_path' => '/storage/' . $path]);
        }
        
        if ($request->hasFile('theme_bg')) {
            $path = $request->file('theme_bg')->store('themes', 'public');
            $campaign->update(['theme_bg_path' => '/storage/' . $path]);
        }

        foreach ($request->items as $index => $itemData) {
            $imagePath = null;
            // Handle product image upload
            // Note: handling array of files in Inertia/Laravel can be tricky if not structured right.
            // Assuming the frontend sends FormData with items[0][image]
            if ($request->hasFile("items.{$index}.image")) {
                 $path = $request->file("items.{$index}.image")->store('products', 'public');
                 $imagePath = '/storage/' . $path;
            }

            // Find or create product
            $product = Product::firstOrCreate(
                ['name' => $itemData['name']],
                ['image_path' => $imagePath] 
            );
            
            if ($imagePath && $product->image_path !== $imagePath) {
                $product->update(['image_path' => $imagePath]);
            }

            CampaignItem::create([
                'campaign_id' => $campaign->id,
                'product_id' => $product->id,
                'variant_label' => $itemData['variant_label'] ?? '',
                'price' => $itemData['price'],
                'sort_order' => $index,
            ]);
        }

        // Refresh the campaign to load the newly created items
        $campaign->refresh();

        $paths = $generator->generateBatch($campaign);

        return Inertia::render('Campaigns/Result', [
            'images' => $paths,
            'campaign' => $campaign
        ]);
    }
    
    public function renderFlyer(Request $request, Campaign $campaign)
    {
        $itemsIds = $request->input('items', []);
        $items = CampaignItem::with('product')->whereIn('id', $itemsIds)->get();
        
        return Inertia::render('Render/Flyer', [
            'items' => $items,
            'theme' => $campaign
        ]);
    }
}
