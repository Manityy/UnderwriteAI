"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl bg-cream p-10 text-center ring-1 ring-black/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-risk-low/15 text-2xl text-risk-low">
          &#10003;
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-ink">Thanks — message received.</h3>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll get back to you about a pilot with your team.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Jane Doe" />
        <Field label="Work email" name="email" type="email" placeholder="jane@insurer.com" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="We'd like to pilot UnderwriteAI on a few AI use cases..."
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-sm font-medium text-risk-high">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
