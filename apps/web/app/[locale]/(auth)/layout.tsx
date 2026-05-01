import { Link } from "../../../i18n/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Form Side */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary-600">مركزي</h1>
            </Link>
            <p className="mt-2 text-sm text-gray-500">منصة إدارة مراكز التعليم</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            {children}
          </div>
        </div>
      </div>

      {/* Decorative Side — hidden on mobile */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 lg:block">
        <div className="flex h-full flex-col items-center justify-center px-12 text-center text-white">
          <div className="mb-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">أدِر مركزك التعليمي بكل سهولة</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            مدفوعات، حضور، امتحانات، واجبات، إشعارات — كل ما يحتاجه مركزك في منصة واحدة.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { n: "+500", l: "مركز" },
              { n: "+10K", l: "طالب" },
              { n: "99%", l: "رضا" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-lg font-bold">{s.n}</p>
                <p className="text-xs text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
