<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(10);
        return Inertia::render('Products/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image',
        ]);

        $data = $request->only('name');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_path'] = '/storage/' . $path;
        }

        Product::create($data);

        return to_route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image',
        ]);

        $data = $request->only('name');

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image_path) {
                $oldPath = str_replace('/storage/', '', $product->image_path);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('products', 'public');
            $data['image_path'] = '/storage/' . $path;
        }

        $product->update($data);

        return to_route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        if ($product->image_path) {
            $oldPath = str_replace('/storage/', '', $product->image_path);
            Storage::disk('public')->delete($oldPath);
        }
        
        $product->delete();

        return to_route('products.index')->with('success', 'Product deleted successfully.');
    }
}
