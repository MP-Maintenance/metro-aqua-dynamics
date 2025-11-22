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
import QuoteDetailsModal from "@/components/QuoteDetailsModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuoteRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  items: any[];
  profiles?: {
    full_name: string;
  };
}

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const { toast } = useToast();

  const fetchQuotes = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("quote_requests")
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch quote requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from("quote_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Quote status updated to ${newStatus}`,
      });
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id.includes(searchQuery)
  );

  const stats = {
    total: quotes.length,
    pending: quotes.filter((q) => q.status === "pending").length,
    approved: quotes.filter((q) => q.status === "approved").length,
    rejected: quotes.filter((q) => q.status === "rejected").length,
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
          <h2 className="text-3xl font-bold tracking-tight">Quote Requests</h2>
          <p className="text-muted-foreground">Manage customer quote requests</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Quote Requests ({quotes.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes..."
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
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No quote requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuotes.map((quote) => (
                      <TableRow
                        key={quote.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedQuote(quote)}
                      >
                        <TableCell className="font-medium">
                          {quote.profiles?.full_name || "Unknown User"}
                        </TableCell>
                        <TableCell>{quote.items?.length || 0} items</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              quote.status === "approved"
                                ? "default"
                                : quote.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {quote.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(quote.created_at), "PP")}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={quote.status}
                            onValueChange={(value) => updateStatus(quote.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
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

      {selectedQuote && (
        <QuoteDetailsModal
          quote={selectedQuote}
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminQuotes;
