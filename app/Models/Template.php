<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    protected $fillable = [
        'name',
        'theme_color_hex',
        'theme_hero_path',
        'theme_bg_path',
    ];
}
