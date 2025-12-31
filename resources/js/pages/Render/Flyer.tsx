import React from 'react';
import { Head } from '@inertiajs/react';

interface Product {
    name: string;
    image_path: string;
}

interface Item {
    id: number;
    variant_label: string;
    price: number;
    product: Product;
}

interface Theme {
    color_hex: string;
    bg_path?: string;
    hero_path?: string;
    validity_text: string;
}

interface FlyerProps {
    items: Item[];
    theme: Theme;
}

export default function Flyer({ items, theme }: FlyerProps) {
    return (
        <div className="w-[1080px] h-[1920px] relative overflow-hidden flex flex-col items-center"
             style={{ backgroundColor: theme.color_hex }}>
            
            {/* Background Image Layer */}
            {theme.bg_path && (
                <img src={theme.bg_path} className="absolute inset-0 w-full h-full object-cover z-0" />
            )}

            {/* Header / Hero */}
            <div className="z-10 mt-10 w-full flex justify-center">
                 {/* Aqui entra o PNG 3D "Ofertas de Aniversário" */}
                 {theme.hero_path && (
                    <img src={theme.hero_path} className="w-[900px] object-contain drop-shadow-2xl" />
                 )}
            </div>

            {/* Grid de Produtos - 2x2 */}
            <div className="z-10 grid grid-cols-2 gap-8 mt-12 w-[950px]">
                {items.map((item) => (
                    <div key={item.id} className="relative flex flex-col items-center">
                        {/* Imagem do Produto (com transparência) */}
                        <div className="h-[500px] w-full flex items-center justify-center">
                            {item.product.image_path && (
                                <img src={item.product.image_path} 
                                     className="max-h-full max-w-full object-contain drop-shadow-lg" 
                                />
                            )}
                        </div>

                        {/* Informações */}
                        <div className="text-center mt-4">
                            <h2 className="text-white text-3xl font-bold uppercase tracking-wide drop-shadow-md">
                                {item.product.name}
                            </h2>
                            <p className="text-gray-200 text-xl font-medium mt-1">
                                {item.variant_label}
                            </p>
                        </div>

                        {/* Badge de Preço (Bola preta com borda branca) */}
                        <div className="absolute bottom-10 right-4 bg-black/90 border-2 border-white rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-xl">
                            <span className="text-white text-lg font-light -mb-2">R$</span>
                            <span className="text-white text-6xl font-bold tracking-tighter">
                                {String(item.price).replace('.', ',')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Validade */}
            <div className="absolute bottom-0 w-full bg-yellow-600/90 h-32 flex items-center justify-center z-20 rounded-t-[50px]">
                <p className="text-black text-2xl font-bold uppercase">
                    {theme.validity_text}
                </p>
            </div>
        </div>
    );
}
