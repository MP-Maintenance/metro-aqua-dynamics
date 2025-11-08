import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
    }
  }, [product]);

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
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="Enter image URL"
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
