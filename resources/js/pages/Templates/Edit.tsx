import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { update, index } from '@/routes/templates';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Template {
    id: number;
    name: string;
    theme_color_hex: string;
    theme_hero_path: string | null;
    theme_bg_path: string | null;
}

interface Props {
    template: Template;
}

export default function Edit({ template }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: template.name,
        theme_color_hex: template.theme_color_hex,
        theme_hero: null as File | null,
        theme_bg: null as File | null,
    });

    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [bgPreview, setBgPreview] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(update.url(template.id));
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
            { title: 'Edit Template', href: '#' }
        ]}>
            <Head title="Edit Template" />
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
                            <CardTitle>Edit Template</CardTitle>
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
                                    {heroPreview ? (
                                        <div className="mb-2">
                                            <img 
                                                src={heroPreview} 
                                                alt="Hero preview" 
                                                className="h-32 w-auto object-cover rounded border"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">New image preview</p>
                                        </div>
                                    ) : template.theme_hero_path ? (
                                        <div className="mb-2">
                                            <img 
                                                src={template.theme_hero_path} 
                                                alt="Current hero" 
                                                className="h-32 w-auto object-cover rounded border"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Current image</p>
                                        </div>
                                    ) : null}
                                    <Input
                                        id="theme_hero"
                                        type="file"
                                        onChange={e => handleImageChange(e, 'theme_hero', setHeroPreview)}
                                        accept="image/*"
                                    />
                                    <p className="text-xs text-muted-foreground">Leave empty to keep current image</p>
                                    {errors.theme_hero && <div className="text-destructive text-xs">{errors.theme_hero}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="theme_bg">Background Image</Label>
                                    {bgPreview ? (
                                        <div className="mb-2">
                                            <img 
                                                src={bgPreview} 
                                                alt="Background preview" 
                                                className="h-32 w-auto object-cover rounded border"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">New image preview</p>
                                        </div>
                                    ) : template.theme_bg_path ? (
                                        <div className="mb-2">
                                            <img 
                                                src={template.theme_bg_path} 
                                                alt="Current background" 
                                                className="h-32 w-auto object-cover rounded border"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Current image</p>
                                        </div>
                                    ) : null}
                                    <Input
                                        id="theme_bg"
                                        type="file"
                                        onChange={e => handleImageChange(e, 'theme_bg', setBgPreview)}
                                        accept="image/*"
                                    />
                                    <p className="text-xs text-muted-foreground">Leave empty to keep current image</p>
                                    {errors.theme_bg && <div className="text-destructive text-xs">{errors.theme_bg}</div>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
