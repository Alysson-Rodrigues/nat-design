import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { create, edit, destroy } from '@/routes/products';
import { Trash2, Edit as EditIcon, Plus } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    image_path: string | null;
}

interface Props {
    products: {
        data: Product[];
        links: any[];
    };
}

export default function Index({ products }: Props) {
    const { flash } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Products', href: '#' }]}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Products</h1>
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Link>
                        </Button>
                    </div>

                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Product List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">
                                                    {product.image_path ? (
                                                        <img src={product.image_path} alt={product.name} className="h-12 w-12 object-cover rounded" />
                                                    ) : (
                                                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                            No Img
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle font-medium">{product.name}</td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="icon" asChild>
                                                            <Link href={edit.url(product.id)}>
                                                                <EditIcon className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="destructive" size="icon" asChild>
                                                            <Link href={destroy.url(product.id)} method="delete" as="button">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {products.data.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                                    No products found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
