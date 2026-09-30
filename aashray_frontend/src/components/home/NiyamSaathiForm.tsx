"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Globe, Mail, Phone, MapPin, Users, TrendingUp,
  FileText, Upload, CheckCircle2, AlertCircle, Loader2,
  ChevronRight, ChevronLeft, X, Landmark, BadgeCheck, Link2, CalendarDays,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormStatus = "idle" | "submitting" | "success" | "error";

interface UploadedFile { file: File; name: string; error?: string; }

type FieldKey =
  | "company_name" | "website" | "company_email" | "company_phone" | "year_established"
  | "head_office_city" | "state" | "country" | "company_type" | "employee_range" | "turnover_range"
  | "gstin" | "pan" | "registration_number" | "linkedin_url";

type FormFields = Record<FieldKey, string>;
type FormErrors = Partial<Record<FieldKey, string>>;
type Touched = Partial<Record<FieldKey, boolean>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPANY_TYPES = ["Private Limited","Public Limited","LLP","Partnership","Sole Proprietorship","OPC","Other"];
const EMPLOYEE_RANGES = ["1-10","11-50","51-200","201-500","500+"];
const TURNOVER_RANGES = ["< 1 Cr","1-10 Cr","10-25 Cr","25-100 Cr","100+ Cr"];
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];
const CURRENT_YEAR = new Date().getFullYear();
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = ["application/pdf","image/jpeg","image/jpg","image/png","image/webp"];

// ─── Validators ───────────────────────────────────────────────────────────────

const GSTIN_RE   = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAN_RE     = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PHONE_RE   = /^\+?[0-9\s\-()]{7,20}$/;
const URL_RE     = /^https?:\/\/.+\..+/i;
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINKEDIN_RE = /^https?:\/\/(www\.)?linkedin\.com\/company\/.+/i;

function validateField(key: FieldKey, value: string): string {
  const v = value.trim();
  switch (key) {
    case "company_name":
      if (!v) return "Company name is required.";
      if (v.length < 2) return "At least 2 characters required.";
      if (v.length > 255) return "Max 255 characters.";
      return "";
    case "website":
      if (!v) return "Website is required.";
      if (!URL_RE.test(v)) return "Must start with https:// or http:// and include a domain.";
      return "";
    case "company_email":
      if (!v) return "Company email is required.";
      if (!EMAIL_RE.test(v)) return "Enter a valid email (e.g. info@company.in).";
      return "";
    case "company_phone":
      if (!v) return "Phone number is required.";
      if (!PHONE_RE.test(v)) return "7–20 digits. Allowed: +, spaces, hyphens, parentheses.";
      return "";
    case "year_established": {
      if (!v) return "Year is required.";
      const yr = parseInt(v, 10);
      if (isNaN(yr) || yr < 1950 || yr > 2026) return `Select a year between 1950 and 2026.`;
      return "";
    }
    case "head_office_city":
      if (!v) return "City is required.";
      if (v.length < 2) return "Enter a valid city name.";
      return "";
    case "state":      return v ? "" : "Please select a state.";
    case "company_type": return v ? "" : "Please select a company type.";
    case "employee_range": return v ? "" : "Please select an employee range.";
    case "gstin":
      if (!v) return "";
      if (v.length !== 15) return "GSTIN must be exactly 15 characters.";
      if (!GSTIN_RE.test(v)) return "Invalid GSTIN. Example: 22AAAAA0000A1Z5";
      return "";
    case "pan":
      if (!v) return "";
      if (v.length !== 10) return "PAN must be exactly 10 characters.";
      if (!PAN_RE.test(v)) return "Invalid PAN. Example: AAAAA0000A";
      return "";
    case "registration_number":
      if (!v) return "";
      if (v.length > 50) return "Max 50 characters.";
      return "";
    case "linkedin_url":
      if (!v) return "";
      if (!URL_RE.test(v)) return "Must start with https://.";
      if (!LINKEDIN_RE.test(v)) return "Must be linkedin.com/company/…";
      return "";
    default: return "";
  }
}

const STEP_FIELDS: FieldKey[][] = [
  ["company_name","website","company_email","company_phone","year_established"],
  ["head_office_city","state","company_type","employee_range"],
  ["gstin","pan","registration_number","linkedin_url"],
  [],
];

const STEPS = [
  { label: "Company Basics", icon: Building2 },
  { label: "Profile", icon: Users },
  { label: "Legal Details", icon: Landmark },
  { label: "Documents", icon: FileText },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400 mt-1">
      <AlertCircle className="w-4 h-4 shrink-0" />{msg}
    </motion.p>
  );
}

function Field({ label, required, children, hint, error }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-base font-semibold text-neutral-text dark:text-gray-200 mb-0.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error ? <FieldError msg={error} /> : hint && (
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">{hint}</p>
      )}
    </div>
  );
}

// Border/ring helper
function bc(err: boolean) {
  return err
    ? "border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-200"
    : "border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/20";
}

const BASE = "w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-900 text-neutral-text dark:text-white focus:ring-2 outline-none transition-all text-base";
const SEL  = `${BASE} appearance-none cursor-pointer`;

function FileZone({ label, hint, fieldName, file, onFile, onRemove }: {
  label: string; hint: string; fieldName: string;
  file: UploadedFile | null; onFile: (f: UploadedFile) => void; onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (!ALLOWED_MIME.includes(f.type)) { onFile({ file: f, name: f.name, error: "Only PDF, JPG, PNG, or WEBP accepted." }); return; }
    if (f.size > MAX_FILE_BYTES) { onFile({ file: f, name: f.name, error: "File exceeds 10 MB limit." }); return; }
    onFile({ file: f, name: f.name });
  };
  return (
    <div className="flex flex-col gap-1">
      <label className="text-base font-semibold text-neutral-text dark:text-gray-200 mb-0.5">
        {label} <span className="font-normal text-text-secondary">(optional)</span>
      </label>
      {file ? (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-base ${
          file.error ? "border-red-300 bg-red-50 dark:bg-red-900/20" : "border-green-300 bg-green-50 dark:bg-green-900/20"
        }`}>
          {file.error ? <AlertCircle className="w-5 h-5 text-red-500 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
          <span className={`truncate flex-1 ${file.error ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}>{file.name}</span>
          <button type="button" onClick={onRemove} className="p-1 rounded hover:bg-black/10"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary transition-colors bg-gray-50 dark:bg-gray-900/50 hover:bg-primary/5 text-base text-text-secondary">
          <Upload className="w-5 h-5 shrink-0" />Click to upload
        </button>
      )}
      {file?.error ? <FieldError msg={file.error} /> : <p className="text-sm text-text-secondary dark:text-gray-400 mt-0.5">{hint}</p>}
      <input ref={ref} type="file" name={fieldName} accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onChange} />
    </div>
  );
}

function YearPicker({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: boolean }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(() => {
    if (!value) return 2;
    const y = parseInt(value, 10);
    if (y < 1975) return 0;
    if (y < 2000) return 1;
    if (y < 2025) return 2;
    return 3;
  });

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startYear = 1950 + page * 25;
  const years = Array.from({ length: 25 }, (_, i) => startYear + i);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${BASE} flex items-center text-left ${bc(!!error)}`}
      >
        <CalendarDays className="w-5 h-5 text-text-secondary mr-2 shrink-0" />
        <span className={value ? "text-neutral-text dark:text-white" : "text-text-secondary"}>
          {value || "Select Year"}
        </span>
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-[340px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <button type="button" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-6 h-6 text-text-secondary" />
              </button>
              <span className="text-base font-bold text-neutral-text dark:text-white">
                {startYear} - {Math.min(startYear + 24, 2026)}
              </span>
              <button type="button" onClick={() => setPage(p => Math.min(3, p + 1))} disabled={page === 3}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight className="w-6 h-6 text-text-secondary" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 p-4">
              {years.map(y => {
                const isValid = y <= 2026;
                const isSelected = value === String(y);
                return (
                  <button
                    key={y}
                    type="button"
                    disabled={!isValid}
                    onClick={() => { onChange(String(y)); setOpen(false); }}
                    className={`
                      text-sm sm:text-base py-2.5 rounded-md font-medium transition-colors
                      ${!isValid ? "opacity-0 cursor-default" : 
                        isSelected ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-neutral-text dark:text-gray-300"}
                    `}
                  >
                    {isValid ? y : ""}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const EMPTY: FormFields = {
  company_name:"",website:"",company_email:"",company_phone:"",year_established:"",
  head_office_city:"",state:"",country:"India",company_type:"",employee_range:"",turnover_range:"",
  gstin:"",pan:"",registration_number:"",linkedin_url:"",
};

export default function NiyamSaathiForm() {
  const [step, setStep]       = useState(0);
  const [status, setStatus]   = useState<FormStatus>("idle");
  const [submitErr, setSubmitErr] = useState("");
  const [formData, setFD]     = useState<FormFields>(EMPTY);
  const [errors, setErrors]   = useState<FormErrors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [docs, setDocs] = useState<{
    gst_proof_document: UploadedFile | null;
    pan_proof_document: UploadedFile | null;
    registration_proof_document: UploadedFile | null;
  }>({ gst_proof_document: null, pan_proof_document: null, registration_proof_document: null });

  const set = (f: FieldKey, v: string) => {
    setFD((p) => ({ ...p, [f]: v }));
    if (touched[f]) setErrors((p) => ({ ...p, [f]: validateField(f, v) }));
  };
  const touch = (f: FieldKey) => {
    setTouched((p) => ({ ...p, [f]: true }));
    setErrors((p) => ({ ...p, [f]: validateField(f, formData[f]) }));
  };
  const e = (f: FieldKey) => (touched[f] ? errors[f] || "" : "");

  const validateStep = () => {
    const fields = STEP_FIELDS[step];
    const ne: FormErrors = { ...errors }; const nt: Touched = { ...touched };
    fields.forEach((f) => { nt[f] = true; ne[f] = validateField(f, formData[f]); });
    setTouched(nt); setErrors(ne);
    return fields.every((f) => !ne[f]);
  };

  const handleSubmit = async () => {
    let ok = true; const ne: FormErrors = {}; const nt: Touched = {};
    ([0,1,2] as const).forEach((s) =>
      STEP_FIELDS[s].forEach((f) => { nt[f]=true; ne[f]=validateField(f,formData[f]); if(ne[f]) ok=false; })
    );
    if (docs.gst_proof_document?.error || docs.pan_proof_document?.error || docs.registration_proof_document?.error) ok = false;
    setTouched(nt); setErrors(ne);
    if (!ok) { setSubmitErr("Please fix the errors above before submitting."); return; }

    setStatus("submitting"); setSubmitErr("");
    const fd = new globalThis.FormData();
    (Object.entries(formData) as [string,string][]).forEach(([k,v]) => { if (v) fd.append(k,v); });
    if (docs.gst_proof_document?.file && !docs.gst_proof_document.error) fd.append("gst_proof_document", docs.gst_proof_document.file);
    if (docs.pan_proof_document?.file && !docs.pan_proof_document.error) fd.append("pan_proof_document", docs.pan_proof_document.file);
    if (docs.registration_proof_document?.file && !docs.registration_proof_document.error) fd.append("registration_proof_document", docs.registration_proof_document.file);

    try {
      const res = await fetch("/api/partner-applications", { method:"POST", body:fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.length ? err.errors.map((e:{msg:string})=>e.msg).join(", ") : err.error || "Something went wrong.");
      }
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setSubmitErr(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    }
  };

  // ── Success ──────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <motion.div initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }}
          className="flex flex-col items-center text-center max-w-md">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-5">
            <BadgeCheck className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-sans font-semibold text-primary dark:text-white mb-3">Application Submitted!</h3>
          <p className="text-text-secondary dark:text-gray-300 mb-2 leading-relaxed">
            Thank you for applying. Our team will review and reach out at{" "}
            <span className="text-primary dark:text-blue-300 font-medium">{formData.company_email}</span>.
          </p>
          <p className="text-sm text-text-secondary dark:text-gray-400 mb-8">Typical review time: 3–5 business days.</p>
          <button onClick={() => { setStatus("idle");setStep(0);setFD(EMPTY);setErrors({});setTouched({});
            setDocs({gst_proof_document:null,pan_proof_document:null,registration_proof_document:null}); }}
            className="text-primary font-medium hover:underline">Submit another application</button>
        </motion.div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row">

      {/* ── Left panel ───────────────────────────────────────────────────────── */}
      <div className="md:w-80 lg:w-96 bg-primary text-white flex flex-col relative shrink-0 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full p-6 lg:p-10">
          <h2 className="text-2xl lg:text-3xl font-sans font-bold mb-3">Become a NiyamSaathi Partner</h2>
          <p className="text-gray-200 text-base leading-relaxed mb-8">
            Offer AI-guided compliance assessments to your clients — no large in-house team needed.
          </p>

          {/* Step tracker */}
          <div className="space-y-3 mt-auto">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isDone = i < step; const isCurrent = i === step;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isDone ? "bg-green-400/30 text-green-300" : isCurrent ? "bg-accent/30 text-accent" : "bg-white/10 text-white/40"
                  }`}>
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-base font-medium ${
                    isDone ? "text-green-300" : isCurrent ? "text-white" : "text-white/40"
                  }`}>{s.label}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-sm text-gray-400 leading-relaxed">
            Your data is encrypted and used solely for partnership evaluation.
          </p>
        </div>
      </div>

      {/* ── Right panel ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 lg:p-10 flex flex-col h-full">

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-4">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-2 rounded-full flex-1 transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-gray-100 dark:bg-gray-700"
              }`} />
            ))}
          </div>
          <p className="text-sm font-bold text-text-secondary dark:text-gray-400 uppercase tracking-widest mb-2">
            Step {step + 1} of {STEPS.length}
          </p>
          <h3 className="text-3xl font-sans font-bold text-neutral-text dark:text-white mb-6">
            {STEPS[step].label}
          </h3>

          {/* ── Step content ─────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }}
              exit={{ opacity:0,x:-20 }} transition={{ duration:0.2 }}>

              {/* STEP 1 */}
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  <Field label="Company Name" required error={e("company_name")}>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input type="text" value={formData.company_name}
                        onChange={(ev) => set("company_name", ev.target.value)} onBlur={() => touch("company_name")}
                        className={`${BASE} pl-9 ${bc(!!e("company_name"))}`} placeholder="Acme Consulting Pvt Ltd" />
                    </div>
                  </Field>

                  <Field label="Website" required hint="Include https:// or http://" error={e("website")}>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input type="text" value={formData.website}
                        onChange={(ev) => set("website", ev.target.value)} onBlur={() => touch("website")}
                        className={`${BASE} pl-9 ${bc(!!e("website"))}`} placeholder="https://acmeconsulting.in" />
                    </div>
                  </Field>

                  <Field label="Company Email" required error={e("company_email")}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input type="email" value={formData.company_email}
                        onChange={(ev) => set("company_email", ev.target.value)} onBlur={() => touch("company_email")}
                        className={`${BASE} pl-9 ${bc(!!e("company_email"))}`} placeholder="partnerships@acme.in" />
                    </div>
                  </Field>

                  <Field label="Phone Number" required hint="+91 XXXXX XXXXX or international" error={e("company_phone")}>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input type="tel" value={formData.company_phone}
                        onChange={(ev) => set("company_phone", ev.target.value)} onBlur={() => touch("company_phone")}
                        className={`${BASE} pl-9 ${bc(!!e("company_phone"))}`} placeholder="+91 98765 43210" />
                    </div>
                  </Field>

                  <Field label="Year Established" required hint={`1950 – 2026`} error={e("year_established")}>
                    <YearPicker
                      value={formData.year_established}
                      onChange={(val) => { set("year_established", val); touch("year_established"); }}
                      error={!!e("year_established")}
                    />
                  </Field>
                </div>
              )}

              {/* STEP 2 */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  <Field label="Head Office City" required error={e("head_office_city")}>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input type="text" value={formData.head_office_city}
                        onChange={(ev) => set("head_office_city", ev.target.value)} onBlur={() => touch("head_office_city")}
                        className={`${BASE} pl-9 ${bc(!!e("head_office_city"))}`} placeholder="Mumbai" />
                    </div>
                  </Field>

                  <Field label="State" required error={e("state")}>
                    <select value={formData.state}
                      onChange={(ev) => set("state", ev.target.value)} onBlur={() => touch("state")}
                      className={`${SEL} ${bc(!!e("state"))}`}>
                      <option value="">Select state…</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>

                  <Field label="Company Type" required error={e("company_type")}>
                    <select value={formData.company_type}
                      onChange={(ev) => set("company_type", ev.target.value)} onBlur={() => touch("company_type")}
                      className={`${SEL} ${bc(!!e("company_type"))}`}>
                      <option value="">Select type…</option>
                      {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>

                  <Field label="Number of Employees" required error={e("employee_range")}>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <select value={formData.employee_range}
                        onChange={(ev) => set("employee_range", ev.target.value)} onBlur={() => touch("employee_range")}
                        className={`${SEL} pl-9 ${bc(!!e("employee_range"))}`}>
                        <option value="">Select range…</option>
                        {EMPLOYEE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </Field>

                  <Field label="Annual Turnover" hint="Optional">
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <select value={formData.turnover_range}
                        onChange={(ev) => set("turnover_range", ev.target.value)}
                        className={`${SEL} pl-9 ${bc(false)}`}>
                        <option value="">Prefer not to say</option>
                        {TURNOVER_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </Field>
                </div>
              )}

              {/* STEP 3 */}
              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  <Field label="GSTIN" hint="Format: 22AAAAA0000A1Z5 (15 chars)" error={e("gstin")}>
                    <input type="text" value={formData.gstin}
                      onChange={(ev) => set("gstin", ev.target.value.toUpperCase())} onBlur={() => touch("gstin")}
                      maxLength={15} className={`${BASE} font-mono tracking-wide ${bc(!!e("gstin"))}`}
                      placeholder="22AAAAA0000A1Z5" />
                  </Field>

                  <Field label="PAN" hint="Format: AAAAA0000A (10 chars)" error={e("pan")}>
                    <input type="text" value={formData.pan}
                      onChange={(ev) => set("pan", ev.target.value.toUpperCase())} onBlur={() => touch("pan")}
                      maxLength={10} className={`${BASE} font-mono tracking-wide ${bc(!!e("pan"))}`}
                      placeholder="AAAAA0000A" />
                  </Field>

                  <Field label="Registration / CIN Number" hint="CIN or equivalent reg. number" error={e("registration_number")}>
                    <input type="text" value={formData.registration_number}
                      onChange={(ev) => set("registration_number", ev.target.value)} onBlur={() => touch("registration_number")}
                      maxLength={50} className={`${BASE} ${bc(!!e("registration_number"))}`}
                      placeholder="U72900MH2010PTC123456" />
                  </Field>

                  <Field label="LinkedIn Company Page" hint="linkedin.com/company/your-company" error={e("linkedin_url")}>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                      <input type="text" value={formData.linkedin_url}
                        onChange={(ev) => set("linkedin_url", ev.target.value)} onBlur={() => touch("linkedin_url")}
                        className={`${BASE} pl-9 ${bc(!!e("linkedin_url"))}`}
                        placeholder="https://linkedin.com/company/acme" />
                    </div>
                  </Field>

                  <div className="col-span-full mt-2">
                    <p className="text-base text-text-secondary dark:text-gray-400 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                      <strong className="text-neutral-text dark:text-white">All legal fields are optional.</strong>{" "}
                      Providing them speeds up verification. Documents can be uploaded in the next step.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  <div className="col-span-full">
                    <p className="text-base text-text-secondary dark:text-gray-400 mb-2">
                      All uploads are optional. Accepted formats: <strong>PDF, JPG, PNG, WEBP</strong> (max 10 MB each).
                    </p>
                  </div>
                  <FileZone label="GST Certificate" hint="GST registration certificate"
                    fieldName="gst_proof_document" file={docs.gst_proof_document}
                    onFile={(f) => setDocs((d) => ({ ...d, gst_proof_document: f }))}
                    onRemove={() => setDocs((d) => ({ ...d, gst_proof_document: null }))} />
                  <FileZone label="PAN Card" hint="Company PAN (entity-level)"
                    fieldName="pan_proof_document" file={docs.pan_proof_document}
                    onFile={(f) => setDocs((d) => ({ ...d, pan_proof_document: f }))}
                    onRemove={() => setDocs((d) => ({ ...d, pan_proof_document: null }))} />
                  <FileZone label="Certificate of Incorporation" hint="MCA certificate or equivalent"
                    fieldName="registration_proof_document" file={docs.registration_proof_document}
                    onFile={(f) => setDocs((d) => ({ ...d, registration_proof_document: f }))}
                    onRemove={() => setDocs((d) => ({ ...d, registration_proof_document: null }))} />
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Error banner */}
          {(status === "error" || submitErr) && (
            <motion.div initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }}
              className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{submitErr || "Something went wrong. Please try again."}</span>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-neutral-text dark:text-white text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft className="w-5 h-5" />Back
              </button>
            )}
            <div className="ml-auto flex items-center gap-6">
              {step === STEPS.length - 1 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 hidden sm:block">
                  By submitting you agree to our{" "}
                  <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              )}
              <button type="button" disabled={status === "submitting"}
                onClick={() => step < STEPS.length - 1 ? (validateStep() && setStep((s) => s + 1)) : handleSubmit()}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white text-base font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {status === "submitting" ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Submitting…</>
                ) : step === STEPS.length - 1 ? (
                  <><CheckCircle2 className="w-5 h-5" />Submit Application</>
                ) : (
                  <>Continue<ChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
