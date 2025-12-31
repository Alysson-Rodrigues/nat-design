import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { store } from '@/routes/campaigns';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ParsedItem {
    raw_line: string;
    suggested_name: string;
    price: number;
}

interface Props {
    initialItems: ParsedItem[];
    header: string[];
}

export default function Edit({ initialItems, header }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: header[0] || 'New Campaign',
        validity_text: header[1] || 'Valid until...',
        theme_color_hex: '#0f4c18',
        theme_hero: null as File | null,
        theme_bg: null as File | null,
        items: initialItems.map(item => ({
            name: item.suggested_name,
            variant_label: '',
            price: item.price,
            image: null as File | null,
        })),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Edit Campaign', href: '#' }]}>
            <Head title="Edit Campaign" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <form onSubmit={submit} className="w-full max-w-6xl mx-auto">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Edit Campaign Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Campaign Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-destructive text-xs">{errors.name}</div>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="validity_text">Validity Text</Label>
                                    <Input
                                        id="validity_text"
                                        value={data.validity_text}
                                        onChange={e => setData('validity_text', e.target.value)}
                                    />
                                    {errors.validity_text && <div className="text-destructive text-xs">{errors.validity_text}</div>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="theme_color">Theme Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="theme_color"
                                            type="color"
                                            className="h-10 w-20 p-1 cursor-pointer"
                                            value={data.theme_color_hex}
                                            onChange={e => setData('theme_color_hex', e.target.value)}
                                        />
                                        <Input
                                            value={data.theme_color_hex}
                                            onChange={e => setData('theme_color_hex', e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="theme_hero">Hero Image</Label>
                                    <Input
                                        id="theme_hero"
                                        type="file"
                                        onChange={e => setData('theme_hero', e.target.files ? e.target.files[0] : null)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="theme_bg">Background Image</Label>
                                    <Input
                                        id="theme_bg"
                                        type="file"
                                        onChange={e => setData('theme_bg', e.target.files ? e.target.files[0] : null)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Variant</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {data.items.map((item, index) => (
                                            <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">
                                                    <Input
                                                        value={item.name}
                                                        onChange={e => handleItemChange(index, 'name', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Input
                                                        value={item.variant_label}
                                                        onChange={e => handleItemChange(index, 'variant_label', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.price}
                                                        onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                                    />
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Input
                                                        type="file"
                                                        onChange={e => handleItemChange(index, 'image', e.target.files ? e.target.files[0] : null)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Generating...' : 'Generate Flyers'}
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
