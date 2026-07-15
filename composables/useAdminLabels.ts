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

export function useAdminLabels() {
  const actionLabel = (value: unknown) => {
    const key = typeof value === 'string' ? value : ''
    return ADMIN_ACTION_LABELS[key] || 'عملیات مدیریتی'
  }

  const entityLabel = (value: unknown) => {
    const key = typeof value === 'string' ? value : ''
    return ADMIN_ENTITY_LABELS[key] || 'رکورد'
  }

  return { actionLabel, entityLabel }
}
