@php
    $toBase64 = function($path) {
        if (!$path) return '';
        $fullPath = public_path($path);
        if (!file_exists($fullPath)) return '';
        $type = pathinfo($fullPath, PATHINFO_EXTENSION);
        $data = file_get_contents($fullPath);
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    };
@endphp
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
    @vite(['resources/css/app.css'])
</head>
<body>
    <div class="w-[1080px] h-[1920px] relative overflow-hidden flex flex-col bg-[#004d00]"
         style="background-color: {{ $theme->theme_color_hex ?? '#004d00' }}">
        
        {{-- Background Image Layer --}}
        @if($theme->theme_bg_path)
            <img src="{{ $toBase64($theme->theme_bg_path) }}" class="absolute inset-0 w-full h-full object-cover z-0 opacity-50" />
        @endif

        {{-- Hero Section Placeholder --}}
        <div class="z-10 w-full h-[1080px] flex items-start justify-center relative shrink-0 -mt-12">
             @if($theme->theme_hero_path)
                <img src="{{ $toBase64($theme->theme_hero_path) }}" class="w-full h-full object-contain drop-shadow-2xl" />
             @endif
        </div>

        {{-- Product Grid --}}
        <div class="z-10 grid grid-cols-2 gap-x-4 gap-y-8 px-8 content-start -mt-32">
            @foreach($items as $item)
                @php
                    $priceParts = explode(',', number_format($item->price, 2, ',', '.'));
                    $priceInt = $priceParts[0];
                    $priceDec = $priceParts[1];
                @endphp
                <div class="relative h-[320px] flex items-end">
                    {{-- Product Image --}}
                    <div class="absolute left-0 bottom-0 w-[65%] h-full flex items-center justify-center z-10">
                        @if($item->product->image_path)
                            {{-- Back/Larger Product --}}
                            <img src="{{ $toBase64($item->product->image_path) }}" 
                                 class="absolute left-0 bottom-6 w-[85%] h-[85%] object-contain z-0 transform -translate-x-2" 
                            />
                            {{-- Front/Smaller Product --}}
                            <img src="{{ $toBase64($item->product->image_path) }}" 
                                 class="absolute right-0 bottom-0 w-[60%] h-[60%] object-contain z-10 drop-shadow-2xl translate-x-4 translate-y-2" 
                            />
                        @endif
                    </div>

                    {{-- Product Info & Badge --}}
                    <div class="w-full h-full flex flex-col justify-between items-end z-20 pl-[50%]">
                        {{-- Name --}}
                        <h2 class="text-white text-3xl font-bold text-right leading-tight drop-shadow-md mt-4">
                            {{ $item->product->name }}
                        </h2>

                        {{-- Price Badge --}}
                        <div class="relative bg-black border-2 border-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-2xl shrink-0 mb-2 mr-2">
                            <div class="flex items-start leading-none text-white">
                                <span class="text-sm font-medium mt-2 mr-1">R$</span>
                                <span class="text-6xl font-black tracking-tighter">{{ $priceInt }}</span>
                                <span class="text-2xl font-bold mt-1">,{{ $priceDec }}</span>
                            </div>
                            @if($item->variant_label)
                                <span class="text-white text-sm font-medium mt-1">{{ $item->variant_label }}</span>
                            @endif
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Footer --}}
        <div class="z-20 absolute bottom-0 left-0 w-[75%] min-h-[128px] bg-[#8B8000] rounded-tr-[60px] flex items-center px-12 py-6 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]"
             style="background: linear-gradient(to right, #7c7200, #a39600);">
            <p class="text-black text-3xl font-bold leading-tight w-3/4">
                {{ $theme->validity_text ?? 'Ofertas válidas enquanto durarem os estoques!' }}
            </p>
        </div>
    </div>
</body>
</html>
