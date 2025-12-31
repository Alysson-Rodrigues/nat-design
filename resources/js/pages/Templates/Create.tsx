import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { store, index } from '@/routes/templates';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        theme_color_hex: '#0f4c18',
        theme_hero: null as File | null,
        theme_bg: null as File | null,
    });

    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [bgPreview, setBgPreview] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'theme_hero' | 'theme_bg', setPreview: (url: string | null) => void) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData(field, file);
        
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        } else {
            setPreview(null);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Templates', href: index.url() },
            { title: 'Create Template', href: '#' }
        ]}>
            <Head title="Create Template" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="mb-6">
                        <Button variant="ghost" asChild className="pl-0 hover:pl-0 hover:bg-transparent">
                            <Link href={index.url()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Templates
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Template</CardTitle>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Template Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Enter template name"
                                    />
                                    {errors.name && <div className="text-destructive text-xs">{errors.name}</div>}
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
                                    {errors.theme_color_hex && <div className="text-destructive text-xs">{errors.theme_color_hex}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="theme_hero">Hero Image</Label>
                                    {heroPreview && (
                                        <div className="mb-2">
                                            <img 
                                                src={heroPreview} 
                                                alt="Hero preview" 
                                                className="h-32 w-auto object-cover rounded border"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        id="theme_hero"
                                        type="file"
                                        onChange={e => handleImageChange(e, 'theme_hero', setHeroPreview)}
                                        accept="image/*"
                                    />
                                    {errors.theme_hero && <div className="text-destructive text-xs">{errors.theme_hero}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="theme_bg">Background Image</Label>
                                    {bgPreview && (
                                        <div className="mb-2">
                                            <img 
                                                src={bgPreview} 
                                                alt="Background preview" 
                                                className="h-32 w-auto object-cover rounded border"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        id="theme_bg"
                                        type="file"
                                        onChange={e => handleImageChange(e, 'theme_bg', setBgPreview)}
                                        accept="image/*"
                                    />
                                    {errors.theme_bg && <div className="text-destructive text-xs">{errors.theme_bg}</div>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Template'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
