import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ActiveSectionProvider } from "@/components/navbar-active-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActiveSectionProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ActiveSectionProvider>
  );
}

