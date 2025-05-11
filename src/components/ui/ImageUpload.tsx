import { ChangeEvent, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { UploadCloud, X } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
  onFileChange: (file: File) => void;
  initialImage?: string;
  className?: string;
  error?: string;
}

const ImageUpload = ({ 
  onFileChange, 
  initialImage, 
  className,
  error
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass to parent
    onFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Parent might need to handle this differently
  };

  return (
    <div 
      className={twMerge(
        'flex flex-col items-center justify-center space-y-2',
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-40 rounded-md object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className={twMerge(
            'flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 hover:border-blue-400',
            error && 'border-red-500',
          )}
        >
          <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-center text-sm text-gray-500">
            Click to upload an image
          </p>
        </div>
      )}

      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={handleClick}
      >
        {preview ? 'Change Image' : 'Upload Image'}
      </Button>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUpload;