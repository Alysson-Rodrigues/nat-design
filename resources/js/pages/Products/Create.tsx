import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { store, index } from '@/routes/products';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Products', href: index.url() },
            { title: 'Create Product', href: '#' }
        ]}>
            <Head title="Create Product" />
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
                            <CardTitle>Create New Product</CardTitle>
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
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                        accept="image/*"
                                    />
                                    {errors.image && <div className="text-destructive text-xs">{errors.image}</div>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Product'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
