"use client";

import { useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Mode = "email" | "phone";
type Status = "idle" | "sending" | "done" | "error";

const MODES: Record<Mode, { tab: string; placeholder: string; label: string; type: string; inputMode: "email" | "tel"; autoComplete: string }> = {
  email: { tab: "Email", placeholder: "Your work email", label: "Your email address", type: "email", inputMode: "email", autoComplete: "email" },
  phone: { tab: "Phone", placeholder: "Your phone number", label: "Your phone number", type: "tel", inputMode: "tel", autoComplete: "tel" },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s\-().]{6,18}$/;

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="3" />
      <path d="m4.5 7.5 6.3 4.6a2 2 0 0 0 2.4 0l6.3-4.6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M8.2 3.8 6 4.1A2.4 2.4 0 0 0 4 6.6c.4 7.2 6.2 13 13.4 13.4a2.4 2.4 0 0 0 2.5-2l.3-2.2a1.5 1.5 0 0 0-1-1.6l-2.6-.9a1.5 1.5 0 0 0-1.6.4l-.9 1a11 11 0 0 1-5.8-5.8l1-.9a1.5 1.5 0 0 0 .4-1.6l-.9-2.6a1.5 1.5 0 0 0-1.6-1Z" />
    </svg>
  );
}
function EnterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M9.5 9.5 6 13l3.5 3.5" />
      <path d="M6.5 13h8.2c1.8 0 2.8-1 2.8-2.8v-.4c0-1.8-1-2.8-2.8-2.8h-1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** Twain-style folder-tab field: pick Email or Phone, type it, hit enter. */
export function HeroLeadForm({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("email");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const m = MODES[mode];

  const pick = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setValue("");
    setError("");
    if (status === "error") setStatus("idle");
    requestAnimationFrame(() => input.current?.focus());
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = value.trim();
    const ok = mode === "email" ? EMAIL_RE.test(v) : PHONE_RE.test(v) && v.replace(/\D/g, "").length >= 7;
    if (!ok) {
      setStatus("error");
      setError(mode === "email" ? "Please enter a valid email address." : "Please enter a valid phone number.");
      input.current?.focus();
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const honeypot = (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: mode, value: v, company: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} noValidate className={cn("lead", className)} data-mode={mode} data-status={status}>
      <div className="lead__tabs" role="tablist" aria-label="How should we reach you?">
        {(Object.keys(MODES) as Mode[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={mode === k}
            onClick={() => pick(k)}
            className={cn("lead__tab", mode === k && "is-active")}
            disabled={status === "done"}
          >
            {MODES[k].tab}
            {k === "email" && <span className="lead__chip">Free call</span>}
          </button>
        ))}
      </div>

      <div className="lead__box">
        {status === "done" ? (
          <div className="lead__field lead__done" role="status">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-pink text-white">
              <CheckIcon />
            </span>
            <span className="flex-1 text-[15px] text-ink">
              Thanks! We&apos;ll reach out to <strong className="font-medium">{value.trim()}</strong> soon.
            </span>
            <button
              type="button"
              className="shrink-0 text-sm text-ink-3 underline-offset-4 hover:text-pink-2 hover:underline"
              onClick={() => {
                setValue("");
                setStatus("idle");
              }}
            >
              Edit
            </button>
          </div>
        ) : (
          <label className="lead__field">
            <span className="lead__icon" key={mode}>
              {mode === "email" ? <MailIcon /> : <PhoneIcon />}
            </span>
            <span className="sr-only">{m.label}</span>
            <input
              ref={input}
              name={mode}
              type={m.type}
              inputMode={m.inputMode}
              autoComplete={m.autoComplete}
              placeholder={m.placeholder}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (status === "error") {
                  setStatus("idle");
                  setError("");
                }
              }}
              aria-invalid={status === "error"}
              aria-describedby="lead-msg"
              className="lead__input"
              maxLength={120}
            />
            {/* honeypot for bots */}
            <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <button type="submit" className="lead__submit" aria-label="Submit" disabled={status === "sending"} data-cursor="link">
              {status === "sending" ? <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <EnterIcon />}
            </button>
          </label>
        )}
      </div>

      <p id="lead-msg" className={cn("lead__note", status === "error" && "is-error")} aria-live="polite">
        {status === "error" ? error : status === "done" ? "Our team will get in touch to plan your free strategy call." : "Leave your email or phone and we will call you back. No spam."}
      </p>
    </form>
  );
}
