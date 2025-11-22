import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminQuotes = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quote Requests</h2>
          <p className="text-muted-foreground">Manage customer quote requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Quote Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Quote requests management interface coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminQuotes;
