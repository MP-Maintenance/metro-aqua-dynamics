import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { compressImage, validateImageFile, generateUniqueFilename } from "@/lib/imageUtils";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  availability: string;
  image_url?: string;
  price?: number;
}

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const ProductEditModal = ({ product, isOpen, onClose, onSave }: ProductEditModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    availability: "available",
    image_url: "",
    price: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        availability: product.availability || "available",
        image_url: product.image_url || "",
        price: product.price?.toString() || "",
      });
      setImagePreview(product.image_url || "");
    }
  }, [product]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploading(true);
    try {
      // Compress image before upload
      const compressedBlob = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
      });

      const fileName = generateUniqueFilename(file.name);
      const compressedFile = new File([compressedBlob], fileName, {
        type: "image/jpeg",
      });

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);

      toast.success("Image uploaded and compressed successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, image_url: "" });
    setImagePreview("");
  };

  const handleSave = async () => {
    if (!product?.id) return;
    
    setSaving(true);
    try {
      const updateData: any = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        availability: formData.availability,
        image_url: formData.image_url || null,
      };

      if (formData.price) {
        updateData.price = parseFloat(formData.price);
      }

      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", product.id);

      if (error) throw error;

      toast.success("Product updated successfully!");
      onSave?.();
      onClose();
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product details below. Changes will be saved to the database.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Enter category"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div>
            <Label>Product Image (Optional)</Label>
            
            {imagePreview && (
              <div className="relative w-32 h-32 mb-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <Label htmlFor="product-image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted/50 transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                  </div>
                </Label>
                <Input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-2">
              Or paste an image URL:
            </div>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => {
                setFormData({ ...formData, image_url: e.target.value });
                setImagePreview(e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="price">Price (Optional)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter price"
            />
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <select
              id="availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="available">Available</option>
              <option value="not-available">Not Available</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
