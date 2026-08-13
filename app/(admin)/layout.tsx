import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import AdminShell from "@/components/admin/layout/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <AdminShell user={session?.user}>
      {children}
    </AdminShell>
  );
}
