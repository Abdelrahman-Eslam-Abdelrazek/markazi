import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";

export default async function NotificationsPage() {
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: publicUser } = await ctx.supabase
    .from("users")
    .select("id")
    .eq("auth_id", ctx.user.id)
    .single();

  let notifications: any[] = [];
  if (publicUser) {
    const { data } = await ctx.supabase
      .from("notifications")
      .select("id, type, title, body, status, read_at, created_at")
      .eq("user_id", publicUser.id)
      .eq("center_id", ctx.centerId)
      .order("created_at", { ascending: false })
      .limit(50);
    notifications = data || [];
  }

  const unreadCount = notifications.filter((n: any) => !n.read_at).length;

  const typeIcons: Record<string, { bg: string; icon: string }> = {
    PAYMENT_RECEIVED: { bg: "bg-emerald-100 text-emerald-600", icon: "💰" },
    PAYMENT_DUE: { bg: "bg-amber-100 text-amber-600", icon: "⏰" },
    ENROLLMENT: { bg: "bg-blue-100 text-blue-600", icon: "📚" },
    ATTENDANCE: { bg: "bg-purple-100 text-purple-600", icon: "✅" },
    SYSTEM: { bg: "bg-gray-100 text-gray-600", icon: "⚙️" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
          <p className="mt-1 text-sm text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} إشعار غير مقروء`
              : "لا توجد إشعارات جديدة"}
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 rounded-2xl bg-gray-100 p-4">
            <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">لا توجد إشعارات</h3>
          <p className="max-w-sm text-sm text-gray-500">
            ستظهر هنا الإشعارات المتعلقة بالمدفوعات والحضور والتحديثات.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {notifications.map((notification: any) => {
              const typeInfo = typeIcons[notification.type] ?? { bg: "bg-gray-100 text-gray-600", icon: "⚙️" };
              const isUnread = !notification.read_at;
              const timeAgo = getTimeAgo(notification.created_at);

              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 px-5 py-4 transition ${
                    isUnread ? "bg-primary-50/30" : "hover:bg-gray-50/50"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${typeInfo.bg}`}>
                    {typeInfo.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${isUnread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                        {notification.title || "إشعار"}
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-gray-400">{timeAgo}</span>
                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-primary-500" />
                        )}
                      </div>
                    </div>
                    {notification.body && (
                      <p className="mt-0.5 text-sm text-gray-500">{notification.body}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return date.toLocaleDateString("ar-EG");
}
