import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  cover_image: string;
  category: string;
  description: string;
  demo_url?: string;
  repo_url?: string;
}

interface ProjectEditModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const ProjectEditModal = ({ project, isOpen, onClose, onSave }: ProjectEditModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    cover_image: "",
    category: "",
    description: "",
    demo_url: "",
    repo_url: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        cover_image: project.cover_image || "",
        category: project.category || "",
        description: project.description || "",
        demo_url: project.demo_url || "",
        repo_url: project.repo_url || "",
      });
    }
  }, [project]);

  const handleSave = async () => {
    if (!project?.id) return;
    
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("projects")
        .update({
          title: formData.title,
          cover_image: formData.cover_image,
          category: formData.category,
          description: formData.description,
          demo_url: formData.demo_url || null,
          repo_url: formData.repo_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id);

      if (error) throw error;

      toast.success("Project updated successfully!");
      onSave?.();
      onClose();
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast.error(error.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to the project details below. Changes will be saved to the database.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter project title"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., villas, hotels, parks"
            />
          </div>

          <div>
            <Label htmlFor="cover_image">Cover Image URL</Label>
            <Input
              id="cover_image"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              placeholder="Enter image URL"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="demo_url">Demo URL (Optional)</Label>
              <Input
                id="demo_url"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="repo_url">Repository URL (Optional)</Label>
              <Input
                id="repo_url"
                value={formData.repo_url}
                onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              rows={4}
            />
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

export default ProjectEditModal;
