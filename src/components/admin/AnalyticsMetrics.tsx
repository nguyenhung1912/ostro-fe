import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import type { AnalyticsData } from "@/services/adminService";
import { Line, Bar } from "react-chartjs-2";
import { useThemeStore } from "@/stores/useThemeStore";
import { Loader2, ShieldAlert } from "lucide-react";
import { sileo } from "sileo";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export function AnalyticsMetrics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useThemeStore();

  const loadAnalytics = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      const res = await adminService.fetchAnalytics();
      setData(res);
    } catch {
      sileo.error({
        title: "Lỗi tải thống kê",
        description: "Không thể lấy dữ liệu phân tích từ máy chủ.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAnalytics(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">
          Đang phân tích dữ liệu hệ thống...
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <ShieldAlert className="h-10 w-10 mb-2 opacity-50" />
        <span className="text-sm">Không thể tải dữ liệu thống kê.</span>
      </div>
    );
  }

  // Common Options
  const textColor = isDark
    ? "rgba(255, 255, 255, 0.7)"
    : "rgba(17, 24, 39, 0.7)";
  const gridColor = isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(17, 24, 39, 0.08)";

  const chartOptions: ChartOptions<"line" | "bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? "#1f1f23" : "#ffffff",
        titleColor: isDark ? "#ffffff" : "#111827",
        bodyColor: isDark ? "#a1a1aa" : "#4b5563",
        borderColor: gridColor,
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            family: "Inter",
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          font: {
            family: "Inter",
            size: 10,
          },
          precision: 0,
        },
      },
    },
  };

  // 1. Message Volume Chart Data
  const messageDates = data.messageVolume.map((item) => {
    // Format date string YYYY-MM-DD to DD/MM
    const parts = item.date.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}` : item.date;
  });
  const messageCounts = data.messageVolume.map((item) => item.count);

  const messageVolumeData = {
    labels: messageDates,
    datasets: [
      {
        fill: true,
        label: "Số tin nhắn",
        data: messageCounts,
        borderColor: isDark ? "#3b82f6" : "#1f3c5e", // Electric blue in dark / Navy in light
        backgroundColor: isDark
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(31, 60, 94, 0.06)",
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: isDark ? "#3b82f6" : "#1f3c5e",
        pointHoverRadius: 6,
      },
    ],
  };

  // 2. Registration Growth Chart Data
  const growthDates = data.registrationGrowth.map((item) => {
    const parts = item.date.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}` : item.date;
  });
  const growthCounts = data.registrationGrowth.map((item) => item.count);

  const growthData = {
    labels: growthDates,
    datasets: [
      {
        label: "Tài khoản mới",
        data: growthCounts,
        backgroundColor: isDark
          ? "rgba(244, 63, 94, 0.75)"
          : "rgba(217, 119, 6, 0.75)", // Pink in dark / Amber in light
        borderRadius: 4,
      },
    ],
  };

  // 3. DAU / MAU Activity comparison (Bar Chart)
  const dauMauData = {
    labels: [
      "Số người dùng hoạt động trong ngày (DAU)",
      "Số người dùng hoạt động trong tháng (MAU)",
    ],
    datasets: [
      {
        label: "Người dùng hoạt động",
        data: [data.dau, data.mau],
        backgroundColor: isDark
          ? ["rgba(59, 130, 246, 0.8)", "rgba(139, 92, 246, 0.8)"]
          : ["rgba(31, 60, 94, 0.8)", "rgba(128, 161, 193, 0.8)"],
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Message Volume */}
      <Card className="liquid-glass border-border/40 bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide text-foreground">
            Lưu lượng tin nhắn (7 ngày qua)
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Tổng số tin nhắn được gửi đi hàng ngày trên hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] w-full pb-4">
          <Line
            data={messageVolumeData}
            options={chartOptions as ChartOptions<"line">}
          />
        </CardContent>
      </Card>

      {/* Chart 2: Registration Growth */}
      <Card className="liquid-glass border-border/40 bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide text-foreground">
            Tốc độ tăng trưởng tài khoản (14 ngày qua)
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Số lượng người dùng mới đăng ký hàng ngày.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] w-full pb-4">
          <Bar
            data={growthData}
            options={chartOptions as ChartOptions<"bar">}
          />
        </CardContent>
      </Card>

      {/* Chart 3: Active Users Ratio */}
      <Card className="liquid-glass border-border/40 bg-card overflow-hidden lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide text-foreground">
            Tương quan hoạt động người dùng (DAU vs MAU)
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            So sánh trực tiếp số lượng người dùng hoạt động trong ngày (DAU) và
            tháng (MAU).
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] w-full pb-4 max-w-2xl mx-auto">
          <Bar
            data={dauMauData}
            options={
              {
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  x: {
                    ...chartOptions.scales?.x,
                    grid: {
                      display: false,
                    },
                  },
                },
              } as ChartOptions<"bar">
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
