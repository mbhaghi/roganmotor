/**
 * مدل دادهٔ محصول و سازگاری خودرو.
 * دقیقاً مطابق docs/02 بخش ۲٫۷ و docs/03 بخش ۳٫۶ طراحی شده است.
 */

export type BaseType = 'mineral' | 'semi_synthetic' | 'full_synthetic';
export type ApprovalLevel = 'approved' | 'meets' | 'suitable_for';
export type SapsLevel = 'full' | 'mid' | 'low';
export type VerificationStatus = 'verified' | 'unverified' | 'demo';

export interface OemApproval {
  code: string;
  level: ApprovalLevel;
}

export interface Volume {
  liters: number;
  /** واحد بسته‌بندی — برای گریس کیلوگرم است */
  unit?: 'L' | 'kg';
  /** قیمت خرده‌فروشی (نمونه) */
  price: number;
  sku: string;
  stock: number;
  batchCode?: string;
  productionDate?: string;
}

export interface TechSpec {
  viscosity40C?: number;
  viscosity100C?: number;
  viscosityIndex?: number;
  pourPointC?: number;
  flashPointC?: number;
  noackPercent?: number;
  tbn?: number;
  hths?: number;
  density15C?: number;
}

export interface Product {
  slug: string;
  code: string;
  name: string;
  category: string;
  baseType: BaseType;
  baseOilGroup: string;
  saeGrade: string;
  api: string[];
  ilsac: string[];
  acea: string[];
  jaso: string[];
  oem: OemApproval[];
  sapsLevel: SapsLevel;
  hthsMin: number;
  dpfOk: boolean;
  gpfOk: boolean;
  turboGdiOk: boolean;
  hybridOk: boolean;
  wetClutchOk?: boolean;
  highMileage?: boolean;
  techSpec: TechSpec;
  volumes: Volume[];
  shortDescription: string;
  benefits: string[];
  shelfLifeYears: number;
  /** لینک دانلود برگهٔ فنی — در پروتوتایپ به فایل نمونه اشاره می‌کند */
  tdsUrl: string;
  sdsUrl: string;
  /** قیمت عمدهٔ پلکانی بر حسب لیتر */
  wholesaleTiers: { minLiters: number; pricePerLiter: number; label: string }[];
  featured?: boolean;
  tags: string[];
}

export interface Vehicle {
  slug: string;
  make: string;
  model: string;
  generation?: string;
  yearFrom: number;
  yearTo: number;
  engineCode?: string;
  displacementCc?: number;
  fuel: 'petrol' | 'diesel' | 'hybrid';
  aspiration: 'na' | 'turbo';
  hasDpf: boolean;
  hasGpf: boolean;
  /** ویسکوزیته‌های مجاز بر اساس دفترچه */
  saeAllowed: string[];
  saePreferred: string;
  apiRequired: string;
  aceaRequired: string[];
  oemSpec: string[];
  oilCapacityWithFilterL: number;
  oilCapacityNoFilterL: number;
  drainNormalKm: number;
  drainSevereKm: number;
  market: 'iran' | 'global';
  priority: 'high' | 'medium' | 'low';
  /**
   * وضعیت اعتبارسنجی داده — مهم‌ترین فیلد برای ایمنی.
   * رکوردهای `unverified` هرگز به‌عنوان «پیشنهاد قطعی» نمایش داده نمی‌شوند.
   */
  verification: VerificationStatus;
  source: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
  climateTips?: { region: string; grade: string }[];
}

export interface SpecPage {
  slug: string;
  title: string;
  kind: 'sae' | 'api' | 'ilsac' | 'acea' | 'oem' | 'jaso';
  code: string;
  summary: string;
  body: string[];
  keyPoints: string[];
  relatedSlugs?: string[];
  table?: { head: string[]; rows: string[][] };
}

export interface Article {
  slug: string;
  title: string;
  cluster: string;
  excerpt: string;
  body: string[];
  readMinutes: number;
  updated: string;
}

export interface CartItem {
  productSlug: string;
  volumeLiters: number;
  sku: string;
  qty: number;
}
