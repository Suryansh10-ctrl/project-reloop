import { Recycle } from 'lucide-react';
import UploadForm from './upload-form';

export default function GivePage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="text-center mb-12">
        <Recycle className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline">Give Your Waste a New Life</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Turn your trash into treasure. Upload a photo of your item, and let our AI help you find the best way to reloop it.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
