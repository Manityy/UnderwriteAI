"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/70 placeholder:transition-opacity placeholder:duration-300 focus:border-brand focus:shadow-[0_0_0_3px_rgba(43,89,195,0.12),0_0_20px_rgba(43,89,195,0.10)] focus:ring-0 focus:placeholder:opacity-40";

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
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-2xl text-brand">
          &#10003;
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-ink">Thanks — message received.</h3>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll get back to you about a pilot with your team.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-all duration-300 hover:scale-[1.03] hover:bg-brand-dark hover:shadow-[0_8px_24px_rgba(43,89,195,0.28)]"
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
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm shadow-brand/25 transition-all duration-300 hover:scale-[1.03] hover:bg-brand-dark hover:shadow-[0_8px_28px_rgba(43,89,195,0.32)] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-sm"
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
        className={inputClass}
      />
    </div>
  );
}
