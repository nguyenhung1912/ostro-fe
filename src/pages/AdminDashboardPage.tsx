import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { adminService } from "@/services/adminService";
import type { AnalyticsData } from "@/services/adminService";
import { StatCard } from "@/components/admin/StatCard";
import { UserManagement } from "@/components/admin/UserManagement";
import { GroupManagement } from "@/components/admin/GroupManagement";
import { AnalyticsMetrics } from "@/components/admin/AnalyticsMetrics";
import {
  Users,
  MessageSquare,
  Activity,
  ArrowLeft,
  Settings,
  TrendingUp,
  LayoutDashboard,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "groups" | "charts"
  >("overview");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [groupsCount, setGroupsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Security guard check
  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "moderator")) {
      navigate("/chat");
    }
  }, [user, navigate]);

  const loadSummaryData = async () => {
    try {
      setLoading(true);
      const [analyticsData, groupsData, usersData] = await Promise.all([
        adminService.fetchAnalytics(),
        adminService.fetchGroups(),
        adminService.fetchUsers(),
      ]);

      setAnalytics(analyticsData);
      setGroupsCount(groupsData.length);
      setUsersCount(usersData.length);
    } catch {
      // Quiet fail or toast is handled inside services
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSummaryData();
  }, []);

  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  // Calculate trends/ratios
  const dauRatio =
    analytics?.mau && analytics.mau > 0
      ? ((analytics.dau / analytics.mau) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="relative min-h-screen text-foreground transition-all duration-300 font-sans p-6 md:p-8">
      {/* Absolute Mesh Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 dark:bg-purple-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 dark:bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 dark:bg-pink-600/20 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/chat">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-border/40 hover:bg-secondary/20"
                title="Quay lại Chat"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold tracking-tight">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quản lý hệ thống Ostro Chat • Quyền hạn:{" "}
                <span className="capitalize font-semibold text-primary">
                  {user.role}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadSummaryData()}
              className="text-xs h-9 border-border/40 hover:bg-secondary/10"
              disabled={loading}
            >
              {loading && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
              Làm mới dữ liệu
            </Button>
          </div>
        </header>

        {/* Dashboard Tabs Navigation */}
        <div className="flex border-b border-border/30 gap-1 overflow-x-auto beautiful-scrollbar">
          {(
            [
              { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
              { id: "users", label: "Người dùng", icon: Users },
              { id: "groups", label: "Nhóm", icon: MessageSquare },
              { id: "charts", label: "Biểu đồ & Phân tích", icon: TrendingUp },
            ] as const
          ).map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-[2px] ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <IconComp className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Summary Statistics Grid (Shown in Overview tab or top stats row) */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng người dùng"
              value={loading ? "..." : usersCount}
              icon={<Users className="h-4 w-4" />}
              description="Tài khoản trong hệ thống"
              trend={{ value: "+8%", isPositive: true }}
            />
            <StatCard
              title="Tổng nhóm"
              value={loading ? "..." : groupsCount}
              icon={<MessageSquare className="h-4 w-4" />}
              description="Cuộc trò chuyện nhóm"
              trend={{ value: "+12%", isPositive: true }}
            />
            <StatCard
              title="Số người dùng hoạt động trong ngày"
              value={loading ? "..." : analytics?.dau || 0}
              icon={<Activity className="h-4 w-4" />}
              description={`Tỷ lệ hoạt động trong tháng: ${dauRatio}%`}
              trend={{ value: "+3.2%", isPositive: true }}
            />
            <StatCard
              title="Số người dùng hoạt động trong tháng"
              value={loading ? "..." : analytics?.mau || 0}
              icon={<Settings className="h-4 w-4" />}
              description="Người dùng hoạt động 30 ngày qua"
              trend={{ value: "+1.5%", isPositive: true }}
            />
          </div>
        )}

        {/* Dynamic Tab Contents */}
        <main className="transition-all duration-300">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6">
              {/* Quick User Actions Summary Box */}
              <div className="liquid-glass border border-border/40 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-foreground font-semibold text-base">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>Trung tâm Điều hành Hệ thống</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Chào mừng bạn quay trở lại trang quản trị. Tại đây, bạn có
                  quyền theo dõi lưu lượng hoạt động của máy chủ, kiểm duyệt các
                  nhóm chat công khai hoặc riêng tư, phân quyền cho điều phối
                  viên khác và quản lý bảo mật người dùng.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <Button
                    onClick={() => setActiveTab("users")}
                    className="h-10 text-xs text-foreground bg-primary/10 border border-primary/20 hover:bg-primary/20 cursor-pointer"
                  >
                    Đi đến Quản lý Người dùng
                  </Button>
                  <Button
                    onClick={() => setActiveTab("groups")}
                    className="h-10 text-xs text-foreground bg-secondary/20 border border-border/40 hover:bg-secondary/35 cursor-pointer"
                  >
                    Đi đến Quản lý Phòng/Nhóm
                  </Button>
                  <Button
                    onClick={() => setActiveTab("charts")}
                    className="h-10 text-xs text-foreground bg-secondary/20 border border-border/40 hover:bg-secondary/35 cursor-pointer"
                  >
                    Xem Biểu đồ Phân tích
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && <UserManagement />}

          {activeTab === "groups" && <GroupManagement />}

          {activeTab === "charts" && <AnalyticsMetrics />}
        </main>
      </div>
    </div>
  );
}
