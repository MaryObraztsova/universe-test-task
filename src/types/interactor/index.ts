export enum PaymentPlanId {
  MONTHLY = "pdf_master_monthly_49_99_in_all_countries_with_trial_0_99",
  MONTHLY_FULL = "pdf_master_monthly_with_trial_1_99",
  ANNUAL = "pdf_master_yearly_299_00_no_trial+UK_auth_settle",

  MONTHLY_THIRD_EMAIL = "pdf_master_monthly_49_99_50%_discount_with_trial_free",
  MONTHLY_FULL_THIRD_EMAIL = "pdf_master_monthly_49_99_50%_discount_with_trial_free_full",
  MONTHLY_SECOND_EMAIL = "pdf_master_monthly_49_99_50%_discount_with_trial_0_99",
  MONTHLY_FULL_SECOND_EMAIL = "pdf_master_monthly_49_99_50%_discount_with_trial_0_99_full",
}

export enum PAGE_LINKS {
  MAIN = "/",
  PAYMENT = "/payment",
  DASHBOARD = "/dashboard",
}

export enum InternalFileType {
  DOC = "DOC",
  DOCX = "DOCX",
  JPEG = "JPEG",
  JPG = "JPG",
  HEIC = "HEIC",
  HEIF = "HEIF",
  PDF = "PDF",
  PNG = "PNG",
  PPT = "PPT",
  PPTX = "PPTX",
  XLS = "XLS",
  XLSX = "XLSX",
  ZIP = "ZIP",
  BMP = "BMP",
  EPS = "EPS",
  GIF = "GIF",
  SVG = "SVG",
  TIFF = "TIFF",
  WEBP = "WEBP",
  EPUB = "EPUB",
}

export enum Currencies {
  USD = "$",
  GBP = "£",
}

export type Bullets = {
  isIncluded: boolean;
  bullText: JSX.Element;
};

export interface Plan {
  id: PaymentPlanId;
  title: string;
  price: string;
  date: string | null;
  bullets: Bullets[];
  bulletsC?: Bullets[];
  text: string | JSX.Element;
  formattedCurrency?: string;
  fullPrice?: string;
}
