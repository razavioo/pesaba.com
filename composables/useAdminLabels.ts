const ADMIN_ACTION_LABELS: Record<string, string> = {
  'auth.login': 'ورود به پنل',
  'auth.logout': 'خروج از پنل',
  'user.create': 'ایجاد کاربر',
  'user.update': 'ویرایش کاربر',
  'user.delete': 'حذف کاربر',
  'user.password.change': 'تغییر رمز عبور کاربر',
  'content.create': 'ایجاد محتوا',
  'content.update': 'ویرایش محتوا',
  'content.delete': 'حذف محتوا',
  'content.archive': 'بایگانی محتوا',
  'content.restore': 'بازیابی محتوا',
  'redirect.save': 'ذخیره مسیر',
  'setting.save': 'ذخیره تنظیمات',
  'settings.update': 'ویرایش تنظیمات',
  'media.upload': 'بارگذاری رسانه',
  'media.update': 'ویرایش رسانه',
  'media.delete': 'حذف رسانه',
  'lead.update': 'ویرایش درخواست',
  'lead.note.create': 'افزودن یادداشت درخواست',
  'lead.email.retry': 'تلاش مجدد ارسال درخواست',
  'migration.import': 'درون‌ریزی داده',
  'migration.media.import': 'درون‌ریزی رسانه',
  'archive.export': 'خروجی گرفتن از پشتیبان',
  'archive.restore': 'بازیابی پشتیبان',
}

const ADMIN_ENTITY_LABELS: Record<string, string> = {
  user: 'کاربر',
  content: 'محتوا',
  redirect: 'مسیر',
  setting: 'تنظیمات',
  media: 'رسانه',
  lead: 'درخواست',
  archive: 'پشتیبان',
  export: 'خروجی',
}

const ADMIN_STATUS_LABELS: Record<string, string> = {
  active: 'فعال', inactive: 'غیرفعال', archived: 'بایگانی',
  NEW: 'جدید', IN_PROGRESS: 'در حال پیگیری', RESOLVED: 'رسیدگی‌شده', SPAM: 'هرزنامه', ARCHIVED: 'بایگانی',
  pending: 'در انتظار', processing: 'در حال پردازش', completed: 'تکمیل‌شده', failed: 'ناموفق',
  draft: 'پیش‌نویس', in_review: 'در حال بررسی', published: 'منتشرشده',
}

const ADMIN_CONTENT_TYPES: Record<string, string> = {
  page: 'صفحه', product: 'محصول', article: 'مقاله', glossary: 'واژه‌نامه', industry: 'صنعت',
  use_case: 'کاربرد', company: 'شرکت', legal: 'حقوقی',
}

const ADMIN_BLOCK_TYPES: Record<string, string> = {
  hero: 'قهرمان', rich_text: 'متن غنی', media_text: 'رسانه و متن', specification_table: 'جدول مشخصات',
  faq: 'پرسش‌های متداول', notice: 'اعلان', cta: 'فراخوان اقدام', collection: 'مجموعه',
  download_list: 'فهرست دانلود', related_links: 'پیوندهای مرتبط', stat_grid: 'شبکه آمار', card_grid: 'شبکه کارت‌ها',
}

export function useAdminLabels() {
  const actionLabel = (value: unknown) => {
    const key = typeof value === 'string' ? value : ''
    return ADMIN_ACTION_LABELS[key] || 'عملیات مدیریتی'
  }

  const entityLabel = (value: unknown) => {
    const key = typeof value === 'string' ? value : ''
    return ADMIN_ENTITY_LABELS[key] || 'رکورد'
  }

  const statusLabel = (value: unknown) => ADMIN_STATUS_LABELS[String(value)] || 'نامشخص'
  const contentTypeLabel = (value: unknown) => ADMIN_CONTENT_TYPES[String(value)] || 'نوع محتوا'
  const blockTypeLabel = (value: unknown) => ADMIN_BLOCK_TYPES[String(value)] || String(value || 'بلوک')

  return { actionLabel, entityLabel, statusLabel, contentTypeLabel, blockTypeLabel }
}
