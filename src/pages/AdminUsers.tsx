import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface User {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
  role?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await (supabase as any)
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;
      setUsers(profilesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery)
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
            <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Users ({users.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
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
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedUser(user)}
                      >
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.phone || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role || "user"}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(user.created_at), "PP")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Detail Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.full_name}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.phone || "—"}</p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.role || "user"}</p>
              </div>
              <div>
                <Label>Joined</Label>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedUser.created_at), "PPP")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
