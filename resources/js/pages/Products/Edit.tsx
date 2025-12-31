import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { update, index } from '@/routes/products';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    image_path: string | null;
}

interface Props {
    product: Product;
}

export default function Edit({ product }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name,
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // We use post with _method: PUT because Inertia/Laravel handles file uploads better with POST
        post(update.url(product.id));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('image', file);
        
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        } else {
            setPreview(null);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: index.url() },
            { title: 'Edit Product', href: '#' }
        ]}>
            <Head title="Edit Product" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="w-full max-w-2xl mx-auto">
                    <div className="mb-6">
                        <Button variant="ghost" asChild className="pl-0 hover:pl-0 hover:bg-transparent">
                            <Link href={index.url()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Products
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Product</CardTitle>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && <div className="text-destructive text-xs">{errors.name}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Product Image</Label>
                                    {preview ? (
                                        <div className="mb-2">
                                            <img 
                                                src={preview} 
                                                alt="New product image" 
                                                className="h-32 w-auto object-cover rounded border"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">New image preview</p>
                                        </div>
                                    ) : product.image_path ? (
                                        <div className="mb-2">
                                            <img 
                                                src={product.image_path} 
                                                alt="Current product image" 
                                                className="h-32 w-auto object-cover rounded border"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">Current image</p>
                                        </div>
                                    ) : null}
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                    <p className="text-xs text-muted-foreground">Leave empty to keep current image</p>
                                    {errors.image && <div className="text-destructive text-xs">{errors.image}</div>}
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
