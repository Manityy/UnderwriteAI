import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { setRequestLocale } from "next-intl/server";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
