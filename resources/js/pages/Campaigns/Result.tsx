import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    images: string[];
    campaign: any;
}

export default function Result({ images, campaign }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Campaign Generated', href: '#' }]}>
            <Head title="Campaign Generated" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Campaign Generated Successfully!</h1>
                    <p className="mb-4 text-muted-foreground">Campaign: {campaign.name}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>Flyer {index + 1}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <img 
                                        src={`/storage/generated/${image}`} 
                                        alt={`Generated Flyer ${index + 1}`} 
                                        className="w-full h-auto shadow-md rounded-md"
                                    />
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <Button asChild>
                                        <a href={`/storage/generated/${image}`} download>
                                            Download Image
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
