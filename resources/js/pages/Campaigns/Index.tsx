import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Copy, Plus, Eye } from 'lucide-react';
import { create, destroy, duplicate, show } from '@/routes/campaigns';

interface Campaign {
    id: number;
    name: string;
    validity_text: string;
    items_count: number;
    created_at: string;
}

interface Props {
    campaigns: Campaign[];
}

export default function Index({ campaigns }: Props) {
    const { flash } = usePage().props as any;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this campaign?')) {
            router.delete(destroy.url(id));
        }
    };

    const handleDuplicate = (id: number) => {
        router.post(duplicate.url(id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Campaigns', href: '#' }]}>
            <Head title="Campaigns" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Campaigns</h1>
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Campaign
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
                            <CardTitle>Campaign List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">Validity</th>
                                            <th className="px-6 py-3 font-medium">Items</th>
                                            <th className="px-6 py-3 font-medium">Created At</th>
                                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaigns.map((campaign) => (
                                            <tr key={campaign.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-foreground">
                                                    {campaign.name}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {campaign.validity_text}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {campaign.items_count}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(campaign.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link href={show.url(campaign.id)}>
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => handleDuplicate(campaign.id)}
                                                    >
                                                        <Copy className="h-4 w-4 mr-1" />
                                                        Duplicate
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleDelete(campaign.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {campaigns.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                                                    No campaigns found.
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
