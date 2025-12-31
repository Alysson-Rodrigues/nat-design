import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { create, edit, destroy } from '@/routes/templates';
import { Trash2, Edit as EditIcon, Plus } from 'lucide-react';

interface Template {
    id: number;
    name: string;
    theme_color_hex: string;
    theme_hero_path: string | null;
    theme_bg_path: string | null;
}

interface Props {
    templates: {
        data: Template[];
        links: any[];
    };
}

export default function Index({ templates }: Props) {
    const { flash } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Templates', href: '#' }]}>
            <Head title="Templates" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Templates</h1>
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Template
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
                            <CardTitle>Template List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Color</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Hero</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Background</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {templates.data.map((template) => (
                                            <tr key={template.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle font-medium">{template.name}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: template.theme_color_hex }}></div>
                                                        <span>{template.theme_color_hex}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {template.theme_hero_path ? (
                                                        <img src={template.theme_hero_path} alt="Hero" className="h-12 w-12 object-cover rounded" />
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">None</span>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    {template.theme_bg_path ? (
                                                        <img src={template.theme_bg_path} alt="Background" className="h-12 w-12 object-cover rounded" />
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">None</span>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="icon" asChild>
                                                            <Link href={edit.url(template.id)}>
                                                                <EditIcon className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="destructive" size="icon" asChild>
                                                            <Link href={destroy.url(template.id)} method="delete" as="button">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {templates.data.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                    No templates found.
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
