import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { companyDetailsSchema } from "@/features/admin/validation/schemas";
import { ZodError } from "zod";

interface CompanyDetails {
  id: string;
  company_name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  google_map_url: string;
  facebook_url: string;
  instagram_url: string;
  website_url: string;
  logo_url: string;
}

const AdminCompany = () => {
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchCompanyDetails = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("company_details")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      setCompanyDetails(data || {
        id: "",
        company_name: "",
        tagline: "",
        description: "",
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        google_map_url: "",
        facebook_url: "",
        instagram_url: "",
        website_url: "",
        logo_url: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch company details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const handleSave = async () => {
    if (!companyDetails) return;

    setSaving(true);
    try {
      // Validate input using Zod schema
      const validatedData = companyDetailsSchema.parse(companyDetails);

      const { error } = companyDetails.id
        ? await (supabase as any)
            .from("company_details")
            .update(validatedData)
            .eq("id", companyDetails.id)
        : await (supabase as any)
            .from("company_details")
            .insert([validatedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company details saved successfully",
      });
      fetchCompanyDetails();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to save company details",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CompanyDetails, value: string) => {
    if (companyDetails) {
      setCompanyDetails({ ...companyDetails, [field]: value });
    }
  };

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
            <h2 className="text-3xl font-bold tracking-tight">Company Details</h2>
            <p className="text-muted-foreground">Manage company information and settings</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {companyDetails && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={companyDetails.company_name}
                    onChange={(e) => updateField("company_name", e.target.value)}
                    placeholder="Metro Pools Maintenance"
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={companyDetails.tagline || ""}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    placeholder="Professional Pool Services"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={companyDetails.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Company description"
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <Input
                    value={companyDetails.logo_url || ""}
                    onChange={(e) => updateField("logo_url", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={companyDetails.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="info@metropools.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={companyDetails.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={companyDetails.whatsapp || ""}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={companyDetails.address || ""}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Google Maps URL</Label>
                  <Input
                    value={companyDetails.google_map_url || ""}
                    onChange={(e) => updateField("google_map_url", e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Website</Label>
                  <Input
                    value={companyDetails.website_url || ""}
                    onChange={(e) => updateField("website_url", e.target.value)}
                    placeholder="https://metropools.com"
                  />
                </div>
                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={companyDetails.facebook_url || ""}
                    onChange={(e) => updateField("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/metropools"
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={companyDetails.instagram_url || ""}
                    onChange={(e) => updateField("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/metropools"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCompany;
