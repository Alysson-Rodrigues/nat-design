<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index()
    {
        $templates = Template::latest()->paginate(10);
        return Inertia::render('Templates/Index', [
            'templates' => $templates
        ]);
    }

    public function create()
    {
        return Inertia::render('Templates/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'theme_color_hex' => 'required|string|max:7',
            'theme_hero' => 'nullable|image',
            'theme_bg' => 'nullable|image',
        ]);

        $data = $request->only('name', 'theme_color_hex');

        if ($request->hasFile('theme_hero')) {
            $path = $request->file('theme_hero')->store('templates', 'public');
            $data['theme_hero_path'] = '/storage/' . $path;
        }

        if ($request->hasFile('theme_bg')) {
            $path = $request->file('theme_bg')->store('templates', 'public');
            $data['theme_bg_path'] = '/storage/' . $path;
        }

        Template::create($data);

        return to_route('templates.index')->with('success', 'Template created successfully.');
    }

    public function edit(Template $template)
    {
        return Inertia::render('Templates/Edit', [
            'template' => $template
        ]);
    }

    public function update(Request $request, Template $template)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'theme_color_hex' => 'required|string|max:7',
            'theme_hero' => 'nullable|image',
            'theme_bg' => 'nullable|image',
        ]);

        $data = $request->only('name', 'theme_color_hex');

        if ($request->hasFile('theme_hero')) {
            if ($template->theme_hero_path) {
                $oldPath = str_replace('/storage/', '', $template->theme_hero_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('theme_hero')->store('templates', 'public');
            $data['theme_hero_path'] = '/storage/' . $path;
        }

        if ($request->hasFile('theme_bg')) {
            if ($template->theme_bg_path) {
                $oldPath = str_replace('/storage/', '', $template->theme_bg_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('theme_bg')->store('templates', 'public');
            $data['theme_bg_path'] = '/storage/' . $path;
        }

        $template->update($data);

        return to_route('templates.index')->with('success', 'Template updated successfully.');
    }

    public function destroy(Template $template)
    {
        if ($template->theme_hero_path) {
            $oldPath = str_replace('/storage/', '', $template->theme_hero_path);
            Storage::disk('public')->delete($oldPath);
        }
        
        if ($template->theme_bg_path) {
            $oldPath = str_replace('/storage/', '', $template->theme_bg_path);
            Storage::disk('public')->delete($oldPath);
        }
        
        $template->delete();

        return to_route('templates.index')->with('success', 'Template deleted successfully.');
    }
}
