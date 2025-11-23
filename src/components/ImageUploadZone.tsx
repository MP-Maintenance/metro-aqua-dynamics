import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, X, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageEditor } from "./ImageEditor";
import { validateImageFile } from "@/lib/imageUtils";

interface ImageUploadZoneProps {
  imagePreview: string;
  onImageSelect: (file: File) => void;
  onClear: () => void;
  onUrlChange?: (url: string) => void;
  uploading?: boolean;
  label?: string;
  className?: string;
}

/**
 * Drag-and-drop image upload zone with built-in editor
 */
export const ImageUploadZone = ({
  imagePreview,
  onImageSelect,
  onClear,
  onUrlChange,
  uploading = false,
  label = "Image",
  className,
}: ImageUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileValidation(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileValidation(files[0]);
    }
  };

  const handleFileValidation = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setError("");
    // Open editor with the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result as string);
      setIsEditorOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleEditorSave = (croppedBlob: Blob) => {
    // Convert blob to file
    const file = new File([croppedBlob], `edited-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    onImageSelect(file);
    setIsEditorOpen(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative w-32 h-32 mb-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg border"
          />
          <div className="absolute top-1 right-1 flex gap-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => {
                setTempImageSrc(imagePreview);
                setIsEditorOpen(true);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={onClear}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-105"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          uploading && "pointer-events-none opacity-50"
        )}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={cn(
            "w-8 h-8 mb-2 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
          <p className="text-sm font-medium mb-1">
            {isDragging ? "Drop image here" : "Click or drag image to upload"}
          </p>
          <p className="text-xs text-muted-foreground">
            {uploading ? "Uploading..." : "PNG, JPG, WEBP up to 10MB"}
          </p>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* URL Input Option */}
      {onUrlChange && (
        <>
          <div className="text-sm text-muted-foreground text-center">
            Or paste an image URL:
          </div>
          <Input
            value={imagePreview}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={uploading}
          />
        </>
      )}

      {/* Image Editor Modal */}
      {tempImageSrc && (
        <ImageEditor
          imageSrc={tempImageSrc}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleEditorSave}
        />
      )}
    </div>
  );
};
