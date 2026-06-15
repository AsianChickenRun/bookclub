import { AppNav } from "@/components/app-nav";

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="page-shell">
      <AppNav />
      <main className="content-wrap py-8">{children}</main>
    </div>
  );
}
