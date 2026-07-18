"use client";

import { useTranslations } from "next-intl";

type Props = {
  /** Suggested PDF filename stem, e.g. "Corewise-Insurance-AI-risk-report" */
  documentTitle?: string;
};

export function PrintReportButton({ documentTitle }: Props) {
  const t = useTranslations("buttons");

  function handlePrint() {
    const previous = document.title;
    if (documentTitle) {
      document.title = documentTitle;
    }
    window.print();
    document.title = previous;
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark print:hidden"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v8H6z" />
      </svg>
      {t("exportPrint")}
    </button>
  );
}
