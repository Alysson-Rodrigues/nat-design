<?php

namespace App\Services;

use Illuminate\Support\Str;

class OfferParser
{
    public function parse(string $rawText): array
    {
        $lines = explode("\n", $rawText);
        $items = [];
        $header = [];
        
        // Regex agressivo para capturar preço no fim da linha ou linha isolada
        // Aceita: R$ 9.99, $ 9,99, 9.99
        $pricePattern = '/(?:\$|R\$)\s*(\d+[.,]\d{2})|(\d+[.,]\d{2})$/i';

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            // Detectar validade (Header)
            if (Str::contains(Str::lower($line), ['válida', 'validas', 'ofertas'])) {
                $header[] = $line;
                continue;
            }

            if (preg_match($pricePattern, $line, $matches)) {
                // Normaliza preço (troca vírgula por ponto)
                $priceRaw = $matches[1] ?: $matches[2];
                $price = floatval(str_replace(',', '.', $priceRaw));
                
                // O resto é o nome + variante. 
                // A separação exata entre Nome e Variante sem IA é difícil,
                // então vamos salvar tudo como "full_name" e deixar o user editar no CRUD.
                $namePart = trim(preg_replace($pricePattern, '', $line));
                
                $items[] = [
                    'raw_line' => $line,
                    'suggested_name' => $namePart,
                    'price' => $price
                ];
            }
        }

        return ['header' => $header, 'items' => $items];
    }
}
