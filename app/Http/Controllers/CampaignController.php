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
    public function index()
    {
        return Inertia::render('Campaigns/Index', [
            'campaigns' => Campaign::withCount('items')->latest()->get()
        ]);
    }

    public function show(Campaign $campaign)
    {
        $campaign->load('items.product');
        
        // Find generated images
        $files = \Illuminate\Support\Facades\Storage::disk('public')->files('generated');
        $images = collect($files)->filter(function ($file) use ($campaign) {
            return str_starts_with(basename($file), "campaign_{$campaign->id}_batch_");
        })->map(function ($file) {
            return '/storage/' . $file;
        })->values();

        return Inertia::render('Campaigns/Show', [
            'campaign' => $campaign,
            'images' => $images
        ]);
    }

    public function destroy(Campaign $campaign)
    {
        $campaign->delete();
        return to_route('campaigns.index');
    }

    public function duplicate(Campaign $campaign)
    {
        $campaign->load('items.product');

        $items = $campaign->items->map(function ($item) {
            $productName = $item->product->name ?? 'Unknown Product';
            return [
                'raw_line' => $productName . ' ' . $item->price,
                'suggested_name' => $productName,
                'price' => $item->price,
            ];
        })->toArray();

        $prefill = [
            'name' => $campaign->name . ' (Copy)',
            'validity_text' => $campaign->validity_text,
            'theme_color_hex' => $campaign->theme_color_hex,
            'theme_hero_path' => $campaign->theme_hero_path,
            'theme_bg_path' => $campaign->theme_bg_path,
        ];

        session([
            'parsed_campaign' => [
                'items' => $items,
                'header' => [], // Not used when prefill is present
                'prefill' => $prefill
            ]
        ]);

        return to_route('campaigns.review');
    }

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
            'prefill' => $parsed['prefill'] ?? null,
            'templates' => \App\Models\Template::all(),
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
            'template_id' => 'nullable|exists:templates,id',
        ]);

        $campaignData = [
            'name' => $request->name,
            'validity_text' => $request->validity_text,
            'theme_color_hex' => $request->theme_color_hex ?? '#0f4c18',
        ];

        if ($request->template_id) {
            $template = \App\Models\Template::find($request->template_id);
            if ($template) {
                $campaignData['theme_color_hex'] = $template->theme_color_hex;
                $campaignData['theme_hero_path'] = $template->theme_hero_path;
                $campaignData['theme_bg_path'] = $template->theme_bg_path;
            }
        } else {
            if ($request->existing_hero_path) {
                $campaignData['theme_hero_path'] = $request->existing_hero_path;
            }
            if ($request->existing_bg_path) {
                $campaignData['theme_bg_path'] = $request->existing_bg_path;
            }
        }

        // Override with manual inputs if provided
        if ($request->theme_color_hex) {
             $campaignData['theme_color_hex'] = $request->theme_color_hex;
        }

        $campaign = Campaign::create($campaignData);
        
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
