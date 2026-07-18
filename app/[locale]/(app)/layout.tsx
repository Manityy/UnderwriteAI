import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import { AppSidebar } from "@/components/AppSidebar";
import { setRequestLocale } from "next-intl/server";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getSession();
  if (!session) {
    return redirect({ href: "/login", locale });
  }

  return (
    <div className="flex min-h-screen bg-cream/40 print:bg-white">
      <AppSidebar userName={session.name} />
      <div className="min-w-0 flex-1 print:w-full">{children}</div>
    </div>
  );
}
