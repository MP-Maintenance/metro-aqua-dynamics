import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { usePartners } from "@/features/partners/hooks/usePartners";
import { partnersService, type Partner } from "@/features/partners/services/partners.service";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { compressImage, generateUniqueFilename } from "@/lib/imageUtils";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminPartners = () => {
  const { partners, loading, refreshPartners } = usePartners();
  const { toast } = useToast();
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    country: "",
    description: "",
    logo: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      tagline: partner.tagline || "",
      country: partner.country || "",
      description: partner.description || "",
      logo: partner.logo || "",
    });
    setImagePreview(partner.logo || "");
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
    setFormData({
      name: "",
      tagline: "",
      country: "",
      description: "",
      logo: "",
    });
    setImagePreview("");
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Compress image before upload
      const compressedBlob = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
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

      setFormData({ ...formData, logo: publicUrl });
      setImagePreview(publicUrl);

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, logo: "" });
    setImagePreview("");
  };

  const handleSave = async () => {
    try {
      if (editingPartner) {
        await partnersService.update(editingPartner.partnerid, formData);
        toast({
          title: "Success",
          description: "Partner updated successfully",
        });
      } else {
        await partnersService.create(formData);
        toast({
          title: "Success",
          description: "Partner added successfully",
        });
      }
      setEditingPartner(null);
      setIsAddModalOpen(false);
      refreshPartners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save partner",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    
    try {
      await partnersService.delete(id);
      toast({
        title: "Success",
        description: "Partner deleted successfully",
      });
      refreshPartners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete partner",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Partners Management</h1>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-card rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Tagline</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow
                    key={partner.partnerid}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleEdit(partner)}
                  >
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.tagline}</TableCell>
                    <TableCell>{partner.country}</TableCell>
                    <TableCell>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(partner)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(partner.partnerid)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={!!editingPartner || isAddModalOpen} onOpenChange={(open) => {
          if (!open) {
            setEditingPartner(null);
            setIsAddModalOpen(false);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? "Edit Partner" : "Add Partner"}
              </DialogTitle>
              <DialogDescription>
                {editingPartner ? "Update partner information" : "Add a new partner"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <ImageUploadZone
                imagePreview={imagePreview}
                onImageSelect={handleImageUpload}
                onClear={clearImage}
                onUrlChange={(url) => {
                  setFormData({ ...formData, logo: url });
                  setImagePreview(url);
                }}
                uploading={uploading}
                label="Partner Logo"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPartner(null);
                  setIsAddModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPartners;
