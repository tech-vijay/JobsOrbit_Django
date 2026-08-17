import { getAdminSession } from "@/actions/auth.actions";
import AdminShell from "@/components/admin/layout/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminSession();

  return (
    <AdminShell user={user || undefined}>
      {children}
    </AdminShell>
  );
}
