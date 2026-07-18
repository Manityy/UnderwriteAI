import type { ReactNode } from "react";

/**
 * Root layout passes children through; locale HTML tags live in
 * `app/[locale]/layout.tsx` (next-intl App Router pattern).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
