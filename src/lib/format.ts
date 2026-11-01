/** ابزارهای قالب‌بندی فارسی */

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFa(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function faNumber(value: number): string {
  return toFa(value.toLocaleString('en-US'));
}

export function faPrice(value: number): string {
  return `${toFa(value.toLocaleString('en-US'))} تومان`;
}

export function faDecimal(value: number, digits = 1): string {
  return toFa(value.toFixed(digits).replace(/\.0$/, ''));
}

export function faDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString('fa-IR');
  }
}

export const BASE_TYPE_FA: Record<string, string> = {
  mineral: 'مینرال (معدنی)',
  semi_synthetic: 'نیمه سنتتیک',
  full_synthetic: 'تمام سنتتیک',
};

export const SAPS_FA: Record<string, string> = {
  full: 'Full SAPS',
  mid: 'Mid SAPS',
  low: 'Low SAPS',
};

export const APPROVAL_LEVEL_FA: Record<string, { label: string; hint: string; tone: 'good' | 'mid' | 'soft' }> = {
  approved: {
    label: 'تأیید رسمی',
    hint: 'خودروساز محصول را تست و مجوز صادر کرده است.',
    tone: 'good',
  },
  meets: {
    label: 'منطبق با الزام',
    hint: 'تولیدکننده انطباق با مشخصات را ادعا می‌کند؛ مجوز رسمی خودروساز نیست.',
    tone: 'mid',
  },
  suitable_for: {
    label: 'قابل استفاده در مواردی که…',
    hint: 'ضعیف‌ترین سطح ادعا.',
    tone: 'soft',
  },
};

export const VERIFICATION_FA: Record<string, { label: string; tone: 'good' | 'warn' | 'bad' }> = {
  verified: { label: 'تأییدشده از منبع رسمی', tone: 'good' },
  demo: { label: 'دادهٔ نمونه (پروتوتایپ)', tone: 'warn' },
  unverified: { label: 'تأییدنشده — نیازمند بررسی', tone: 'bad' },
};
