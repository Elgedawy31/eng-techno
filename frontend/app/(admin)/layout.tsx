import { getProfile } from "@/features/auth/actions/auth.service";
import { Providers } from "@/app/providers";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = await getProfile();

  return (
    <Providers data={{ user, token }}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </Providers>
  );
}

