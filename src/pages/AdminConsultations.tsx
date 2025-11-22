import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ConsultationDetailsModal from "@/components/ConsultationDetailsModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PreConsultation {
  id: string;
  user_id: string;
  service_required: string;
  facility_type: string;
  surface_type: string;
  finishing: string;
  filtration_system: string;
  length: number;
  width: number;
  depth: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  preferred_contact_method: string;
  status: string;
  reference_file_url: string;
  reference_file_name: string;
  created_at: string;
}

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState<PreConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<PreConsultation | null>(null);
  const { toast } = useToast();

  const fetchConsultations = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("pre_consultations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch pre-consultations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from("pre_consultations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Consultation status updated to ${newStatus}`,
      });
      fetchConsultations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.contact_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.service_required?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: consultations.length,
    pending: consultations.filter((c) => c.status === "pending").length,
    contacted: consultations.filter((c) => c.status === "contacted").length,
    completed: consultations.filter((c) => c.status === "completed").length,
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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pre-Consultations</h2>
          <p className="text-muted-foreground">Manage customer pre-consultation requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contacted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contacted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Pre-Consultations ({consultations.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search consultations..."
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No pre-consultations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredConsultations.map((consultation) => (
                      <TableRow
                        key={consultation.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedConsultation(consultation)}
                      >
                        <TableCell className="font-medium">{consultation.contact_name}</TableCell>
                        <TableCell>{consultation.service_required}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{consultation.contact_phone}</div>
                            <div className="text-muted-foreground">{consultation.contact_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              consultation.status === "completed"
                                ? "default"
                                : consultation.status === "contacted"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {consultation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(consultation.created_at), "PP")}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={consultation.status}
                            onValueChange={(value) => updateStatus(consultation.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
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

      {selectedConsultation && (
        <ConsultationDetailsModal
          consultation={selectedConsultation}
          isOpen={!!selectedConsultation}
          onClose={() => setSelectedConsultation(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminConsultations;
