import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export const statusLabels: Record<string, string> = {
  PENDING: 'Beklemede',
  IN_PROGRESS: 'Devam Ediyor',
  WELDING: 'Kaynak Aşamasında',
  QUALITY_CHECK: 'Kalite Kontrol',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
  DRAFT: 'Taslak',
  SENT: 'Gönderildi',
  PAID: 'Ödendi',
  OVERDUE: 'Gecikmiş',
  PASSED: 'Geçti',
  FAILED: 'Başarısız',
  CONDITIONAL: 'Koşullu',
};

export const priorityLabels: Record<string, string> = {
  LOW: 'Düşük',
  MEDIUM: 'Orta',
  HIGH: 'Yüksek',
  URGENT: 'Acil',
};

export const categoryLabels: Record<string, string> = {
  STEEL: 'Çelik',
  ROD: 'Kaynak Teli',
  GAS: 'Gaz',
  CONSUMABLE: 'Sarf Malzeme',
  TOOL: 'Alet',
  OTHER: 'Diğer',
};
