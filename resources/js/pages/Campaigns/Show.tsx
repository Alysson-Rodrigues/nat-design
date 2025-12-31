import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ArrowLeft } from 'lucide-react';

interface CampaignItem {
    id: number;
    price: number;
    variant_label: string;
    product: {
        name: string;
        image_path: string | null;
    };
}

interface Campaign {
    id: number;
    name: string;
    validity_text: string;
    theme_color_hex: string;
    theme_hero_path: string | null;
    theme_bg_path: string | null;
    items: CampaignItem[];
}

interface Props {
    campaign: Campaign;
    images: string[];
}

export default function Show({ campaign, images }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Campaigns', href: '/campaigns' },
            { title: campaign.name, href: '#' }
        ]}>
            <Head title={campaign.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="w-full max-w-6xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/campaigns">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h1 className="text-2xl font-bold">{campaign.name}</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Generated Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {images.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="border rounded-lg p-2 space-y-2">
                                                <img 
                                                    src={image} 
                                                    alt={`Batch ${index + 1}`} 
                                                    className="w-full h-auto rounded"
                                                />
                                                <Button className="w-full" asChild>
                                                    <a href={image} download>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No generated images found.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground">Validity</div>
                                        <div>{campaign.validity_text}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground">Theme Color</div>
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-6 h-6 rounded border" 
                                                style={{ backgroundColor: campaign.theme_color_hex }}
                                            />
                                            <span>{campaign.theme_color_hex}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Items ({campaign.items.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                        {campaign.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 border-b pb-3 last:border-0">
                                                {item.product.image_path ? (
                                                    <img 
                                                        src={item.product.image_path} 
                                                        alt={item.product.name} 
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs">
                                                        No img
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-sm">{item.product.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.variant_label && `${item.variant_label} • `}
                                                        R$ {item.price.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
