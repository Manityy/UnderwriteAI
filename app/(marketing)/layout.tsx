import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
