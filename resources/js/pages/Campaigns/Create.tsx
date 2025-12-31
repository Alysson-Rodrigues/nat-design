import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { parse } from '@/routes/campaigns';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        text: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(parse.url());
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Create Campaign', href: '#' }]}>
            <Head title="Create Campaign" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>New Campaign</CardTitle>
                        <CardDescription>Paste the WhatsApp text to parse offers.</CardDescription>
                    </CardHeader>
                    <form onSubmit={submit}>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="text">WhatsApp Text</Label>
                                    <textarea
                                        id="text"
                                        className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.text}
                                        onChange={(e) => setData('text', e.target.value)}
                                        placeholder="Paste the offers here..."
                                    />
                                    {errors.text && <div className="text-destructive text-xs">{errors.text}</div>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Parsing...' : 'Parse Offers'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
