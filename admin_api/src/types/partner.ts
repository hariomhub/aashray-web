/**
 * Types & Enums for Aashray Partner Portal Database
 */

export type CompanyType =
  | 'Private Limited'
  | 'Public Limited'
  | 'LLP'
  | 'Partnership'
  | 'Sole Proprietorship'
  | 'OPC'
  | 'Other';

export type EmployeeRange = '1-10' | '11-50' | '51-200' | '201-500' | '500+';

export type TurnoverRange = '< 1 Cr' | '1-10 Cr' | '10-25 Cr' | '25-100 Cr' | '100+ Cr';

export type ApplicationStatus = 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type ContactType = 'PRIMARY' | 'AUTHORIZED_SIGNATORY' | 'TECHNICAL_LEAD' | 'FINANCE_BILLING' | 'OTHER';

export type DocumentType =
  | 'GST_CERTIFICATE'
  | 'PAN_CARD'
  | 'REGISTRATION_CERTIFICATE'
  | 'BANK_PROOF'
  | 'SIGNED_AGREEMENT'
  | 'OTHER';

export type DocumentVerificationStatus =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED';

export type OnboardingStatus =
  | 'NOT_STARTED'
  | 'AGREEMENT_PENDING'
  | 'DOCUMENTS_PENDING'
  | 'DOCUMENT_VERIFICATION'
  | 'COMPLETED'
  | 'EXPIRED';

export type PartnerStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';

export type PartnerTier = 'REGISTERED' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type BankAccountType = 'CURRENT' | 'SAVINGS';

export type UserRole = 'SUPER_ADMIN' | 'PARTNER_ADMIN' | 'DOCUMENT_VERIFIER';

export type EmailType =
  | 'APPLICATION_RECEIVED'
  | 'APPROVAL'
  | 'REJECTION'
  | 'DOCUMENT_REQUEST'
  | 'ONBOARDING_REMINDER'
  | 'ACTIVATED';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerApplicationRow {
  id: string;
  company_name: string;
  website: string;
  company_email: string;
  company_phone: string;
  year_established: number;
  head_office_city: string;
  state: string;
  country: string;
  pincode: string | null;
  address_line1: string | null;
  company_type: CompanyType;
  employee_range: EmployeeRange;
  turnover_range: TurnoverRange | null;
  gstin: string | null;
  pan: string | null;
  registration_number: string | null;
  linkedin_url: string | null;
  status: ApplicationStatus;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerContactRow {
  id: string;
  application_id: string;
  contact_type: ContactType;
  full_name: string;
  designation: string;
  contact_email: string;
  contact_phone: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnerDocumentRow {
  id: string;
  application_id: string;
  document_type: DocumentType;
  file_name: string;
  storage_key: string;
  mime_type: string;
  file_size_bytes: number;
  uploaded_at: string;
  verification_status: DocumentVerificationStatus;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerBankingRow {
  id: string;
  application_id: string;
  beneficiary_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string | null;
  account_type: BankAccountType;
  upi_id: string | null;
  is_verified: boolean;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerOnboardingRow {
  id: string;
  application_id: string;
  onboarding_token: string;
  token_expires_at: string;
  agreement_version: string | null;
  agreement_accepted: boolean;
  agreement_accepted_at: string | null;
  agreement_ip: string | null;
  agreement_signature: string | null;
  onboarding_status: OnboardingStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerRow {
  id: string;
  application_id: string;
  partner_code: string | null;
  partner_tier: PartnerTier;
  commission_rate_pct: number;
  partner_status: PartnerStatus;
  activated_at: string | null;
  suspended_at: string | null;
  suspended_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailLogRow {
  id: string;
  application_id: string | null;
  email_type: EmailType;
  recipient: string;
  subject: string;
  sent_at: string;
  status: 'SENT' | 'FAILED' | 'QUEUED';
  error_message: string | null;
}

export interface AuditLogRow {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}
