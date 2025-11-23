import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trash2, Search, Eye } from "lucide-react";
import { inquiriesService, type Inquiry } from "@/features/inquiries/services/inquiries.service";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminInquiries = () => {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await inquiriesService.getAll();
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (inquiryid: number, status: string) => {
    try {
      await inquiriesService.updateStatus(inquiryid, status);
      toast({
        title: "Status Updated",
        description: "Inquiry status has been updated successfully",
      });
      fetchInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const deleteInquiry = async (inquiryid: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    
    try {
      await inquiriesService.delete(inquiryid);
      toast({
        title: "Inquiry Deleted",
        description: "The inquiry has been deleted successfully",
      });
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const query = searchQuery.toLowerCase();
    return (
      inquiry.fullname.toLowerCase().includes(query) ||
      inquiry.email.toLowerCase().includes(query) ||
      inquiry.inquirytype.toLowerCase().includes(query) ||
      inquiry.servicetype.toLowerCase().includes(query) ||
      inquiry.inquiryid.toString().includes(query)
    );
  });

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === "Pending").length,
    inProgress: inquiries.filter((i) => i.status === "In Progress").length,
    completed: inquiries.filter((i) => i.status === "Completed").length,
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "default";
      case "In Progress":
        return "secondary";
      case "Completed":
        return "outline";
      default:
        return "default";
    }
  };

  const viewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inquiries Management</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries, quote requests, and pre-consultations
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, inquiry type, service type, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow 
                    key={inquiry.inquiryid}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => viewDetails(inquiry)}
                  >
                    <TableCell className="font-medium">#{inquiry.inquiryid}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{inquiry.inquirytype}</Badge>
                    </TableCell>
                    <TableCell>{inquiry.fullname}</TableCell>
                    <TableCell className="text-sm">{inquiry.email}</TableCell>
                    <TableCell className="text-sm">
                      {inquiry.countrycode} {inquiry.mobilenumber}
                    </TableCell>
                    <TableCell>{inquiry.servicetype}</TableCell>
                    <TableCell>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={inquiry.status}
                          onValueChange={(value) => updateStatus(inquiry.inquiryid, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(inquiry.submittedat), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewDetails(inquiry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteInquiry(inquiry.inquiryid)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No inquiries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              Inquiry #{selectedInquiry?.inquiryid} - {selectedInquiry?.inquirytype}
            </DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{selectedInquiry.fullname}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                  <p className="text-base">
                    {selectedInquiry.countrycode} {selectedInquiry.mobilenumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                  <p className="text-base">{selectedInquiry.servicetype}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadgeVariant(selectedInquiry.status)}>
                    {selectedInquiry.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted At</p>
                  <p className="text-base">
                    {format(new Date(selectedInquiry.submittedat), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(value) => {
                    updateStatus(selectedInquiry.inquiryid, value);
                    setDetailsModalOpen(false);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteInquiry(selectedInquiry.inquiryid);
                    setDetailsModalOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Inquiry
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminInquiries;
