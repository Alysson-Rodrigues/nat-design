<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'name',
        'validity_text',
        'theme_color_hex',
        'theme_hero_path',
        'theme_bg_path',
    ];

    public function items()
    {
        return $this->hasMany(CampaignItem::class);
    }
}
