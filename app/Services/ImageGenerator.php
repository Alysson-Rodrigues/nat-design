<?php

namespace App\Services;

use Spatie\Browsershot\Browsershot;
use App\Models\Campaign;

class ImageGenerator
{
    public function generateBatch(Campaign $campaign)
    {
        // Pega itens em chunks de 4
        $chunks = $campaign->items->chunk(4);
        $generatedPaths = [];

        foreach ($chunks as $index => $chunk) {
            $fileName = "campaign_{$campaign->id}_batch_{$index}.jpg";
            $outputPath = storage_path("app/public/generated/{$fileName}");

            // Ensure directory exists
            if (!file_exists(dirname($outputPath))) {
                mkdir(dirname($outputPath), 0755, true);
            }

            // Renderiza o HTML via Blade para evitar deadlock do PHP Server
            $html = view('flyer', [
                'items' => $chunk,
                'theme' => $campaign
            ])->render();

            Browsershot::html($html)
                ->setNodeBinary('/home/glassnephew/.nvm/versions/node/v25.2.1/bin/node')
                ->setNpmBinary('/home/glassnephew/.nvm/versions/node/v25.2.1/bin/npm')
                ->windowSize(1080, 1920) // Formato Story
                ->deviceScaleFactor(2) // Retina quality
                ->setOption('args', ['--no-sandbox'])
                ->waitUntilNetworkIdle()
                ->save($outputPath);

            $generatedPaths[] = $fileName;
        }

        return $generatedPaths;
    }
}
