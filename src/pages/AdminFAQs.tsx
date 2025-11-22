import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { faqSchema } from "@/features/admin/validation/schemas";
import { ZodError } from "zod";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [creatingFaq, setCreatingFaq] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    is_published: true,
  });
  const { toast } = useToast();

  const fetchFaqs = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("faqs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch FAQs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (editingFaq) {
      setFormData({
        question: editingFaq.question,
        answer: editingFaq.answer,
        category: editingFaq.category || "",
        is_published: editingFaq.is_published,
      });
    }
  }, [editingFaq]);

  const handleCreate = async () => {
    try {
      // Validate input with Zod
      const validatedFaq = faqSchema.parse(formData);

      const { error } = await (supabase as any)
        .from("faqs")
        .insert([validatedFaq]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ created successfully",
      });
      setCreatingFaq(false);
      setFormData({ question: "", answer: "", category: "", is_published: true });
      fetchFaqs();
    } catch (error: any) {
      if (error instanceof ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create FAQ",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingFaq) return;

    try {
      // Validate input with Zod
      const validatedFaq = faqSchema.parse(formData);

      const { error } = await (supabase as any)
        .from("faqs")
        .update(validatedFaq)
        .eq("id", editingFaq.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
      setEditingFaq(null);
      fetchFaqs();
    } catch (error: any) {
      if (error instanceof ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to update FAQ",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const { error } = await (supabase as any)
        .from("faqs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
      fetchFaqs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">FAQs Management</h2>
            <p className="text-muted-foreground">Manage frequently asked questions</p>
          </div>
          <Button onClick={() => setCreatingFaq(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All FAQs ({faqs.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaqs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No FAQs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFaqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium line-clamp-1">{faq.question}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {faq.answer}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{faq.category || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={faq.is_published ? "default" : "secondary"}>
                            {faq.is_published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingFaq(faq)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(faq.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={creatingFaq || !!editingFaq} onOpenChange={() => {
        setCreatingFaq(false);
        setEditingFaq(null);
        setFormData({ question: "", answer: "", category: "", is_published: true });
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
            <DialogDescription>
              {editingFaq ? "Update FAQ details" : "Create a new frequently asked question"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the question"
              />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter the answer"
                rows={4}
              />
            </div>
            <div>
              <Label>Category (Optional)</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Maintenance, Services, Booking"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCreatingFaq(false);
                  setEditingFaq(null);
                  setFormData({ question: "", answer: "", category: "", is_published: true });
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingFaq ? handleUpdate : handleCreate}>
                {editingFaq ? "Update FAQ" : "Create FAQ"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminFAQs;
