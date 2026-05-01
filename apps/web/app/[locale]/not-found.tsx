import { Link } from "../../i18n/navigation";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <h1 className="mt-4 text-xl font-bold text-gray-900">الصفحة غير موجودة</h1>
      <p className="mt-2 text-sm text-gray-500">الصفحة اللي بتدور عليها مش موجودة أو تم نقلها.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
