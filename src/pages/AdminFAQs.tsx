import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminFAQs = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">FAQs Management</h2>
          <p className="text-muted-foreground">Manage frequently asked questions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">FAQs management interface coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFAQs;
