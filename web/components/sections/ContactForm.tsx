"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { sendContactMessage, type ContactField } from "@/lib/api";

type Status = "idle" | "sending" | "sent" | "error";

/** Limits mirror the server-side validator in the API. */
const LIMITS = { name: 100, email: 254, message: 5000 } as const;

const inputClass =
  "mt-1 block w-full rounded-md border border-border bg-bg px-3 py-2 text-fg-strong placeholder:text-fg-muted focus:border-accent aria-[invalid=true]:border-danger";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ContactField, string>>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");
    setFieldErrors({});

    const result = await sendContactMessage({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    });

    if (result.ok) {
      form.reset();
      setStatus("sent");
    } else {
      setStatus("error");
      setError(result.message);
      setFieldErrors(result.fieldErrors);
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="rounded-lg border border-accent bg-accent-soft p-4 text-fg-strong">
        Thanks, your message is on its way. I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field id="name" label="Name" error={fieldErrors.name}>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={LIMITS.name}
          autoComplete="name"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className={inputClass}
        />
      </Field>
      <Field id="email" label="Email" error={fieldErrors.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={LIMITS.email}
          autoComplete="email"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className={inputClass}
        />
      </Field>
      <Field id="message" label="Message" error={fieldErrors.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={LIMITS.message}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={inputClass}
        />
      </Field>

      {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-fg-strong">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
