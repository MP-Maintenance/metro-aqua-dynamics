import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminConsultations = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pre-Consultations</h2>
          <p className="text-muted-foreground">Manage customer pre-consultation requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Pre-Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Pre-consultations management interface coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminConsultations;
