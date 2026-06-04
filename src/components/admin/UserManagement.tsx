import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import type { AdminUser } from "@/services/adminService";
import { sileo } from "sileo";
import {
  Search,
  Lock,
  Unlock,
  Trash2,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { Pagination } from "@/components/ui/pagination";

export function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "online" | "offline" | "banned" | "inactive"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "ban" | "unban" | "delete";
    user: AdminUser | null;
  }>({
    isOpen: false,
    type: "ban",
    user: null,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search, statusFilter]);

  const currentUser = useAuthStore((state) => state.user);
  const isCurrentUserAdmin = currentUser?.role === "admin";

  const loadUsers = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      const data = await adminService.fetchUsers();
      setUsers(data);
    } catch {
      sileo.error({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách người dùng từ hệ thống.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadUsers(false);
  }, []);

  const handleActionClick = (
    type: "ban" | "unban" | "delete",
    user: AdminUser,
  ) => {
    // Prevent banning or deleting yourself
    if (
      user._id === currentUser?._id &&
      (type === "ban" || type === "delete")
    ) {
      sileo.error({
        title: "Thao tác không hợp lệ",
        description:
          "Bạn không thể tự khóa hoặc tự xóa tài khoản của chính mình.",
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      type,
      user,
    });
  };

  const handleConfirmAction = async () => {
    const { type, user } = confirmDialog;
    if (!user) return;

    try {
      if (type === "ban" || type === "unban") {
        await adminService.toggleBan(user._id);
        sileo.success({
          title: "Thành công",
          description: `Đã ${type === "ban" ? "khóa" : "mở khóa"} tài khoản của ${user.displayName}.`,
        });
      } else if (type === "delete") {
        await adminService.deleteUser(user._id);
        sileo.success({
          title: "Thành công",
          description: `Đã xóa hoàn toàn tài khoản của ${user.displayName} khỏi hệ thống.`,
        });
      }
      void loadUsers();
    } catch {
      sileo.error({
        title: "Thao tác thất bại",
        description: "Gặp sự cố khi thực hiện yêu cầu. Vui lòng thử lại.",
      });
    } finally {
      setConfirmDialog({ isOpen: false, type: "ban", user: null });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      sileo.success({
        title: "Cập nhật vai trò thành công",
        description: "Vai trò của người dùng đã được thay đổi.",
      });
      void loadUsers();
    } catch {
      sileo.error({
        title: "Lỗi phân quyền",
        description: "Bạn không có quyền thực hiện hoặc gặp lỗi hệ thống.",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    if (currentPage > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [filteredUsers.length, currentPage, pageSize]);

  const getStatusBadge = (status: AdminUser["status"]) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20 border-none font-medium capitalize">
            Online
          </Badge>
        );
      case "offline":
        return (
          <Badge className="bg-zinc-500/15 text-zinc-500 hover:bg-zinc-500/20 border-none font-medium capitalize">
            Offline
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-rose-500/15 text-rose-500 hover:bg-rose-500/20 border-none font-medium capitalize">
            Banned
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-none font-medium capitalize">
            Chưa kích hoạt
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-secondary/30 rounded-lg border border-border/40 w-fit">
          {(
            [
              { label: "Tất cả", value: "all" },
              { label: "Online", value: "online" },
              { label: "Offline", value: "offline" },
              { label: "Banned", value: "banned" },
              { label: "Chưa kích hoạt", value: "inactive" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-semibold transition-all ${
                statusFilter === filter.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border/45 bg-card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Đang tải danh sách người dùng...
            </span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <ShieldAlert className="h-10 w-10 mb-2 opacity-50" />
            <span className="text-sm">
              Không tìm thấy người dùng nào phù hợp.
            </span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto beautiful-scrollbar">
              <table className="w-full text-sm md:text-[15px] text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/15 text-xs md:text-sm text-muted-foreground uppercase font-bold">
                    <th className="px-6 py-4 w-[28%]">Người dùng</th>
                    <th className="px-6 py-4 w-[24%]">Email</th>
                    <th className="px-6 py-4 w-[16%]">Trạng thái</th>
                    <th className="px-6 py-4 w-[12%]">Vai trò</th>
                    <th className="px-6 py-4 w-[12%]">Ngày tham gia</th>
                    <th className="px-6 py-4 w-[8%] text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-secondary/5 transition-colors"
                    >
                      <td className="px-6 py-4 overflow-hidden text-ellipsis">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage
                              src={user.avatarUrl}
                              alt={user.displayName}
                            />
                            <AvatarFallback>
                              {user.displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-foreground text-sm md:text-base truncate">
                              {user.displayName}
                            </span>
                            <span className="text-xs md:text-sm text-muted-foreground truncate">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground truncate overflow-hidden text-ellipsis">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isCurrentUserAdmin && user._id !== currentUser?._id ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="capitalize text-xs md:text-sm px-3 py-1 h-8 border-border/40 hover:bg-secondary/10"
                              >
                                {user.role}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              className="w-32 bg-card border-border/40"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  void handleRoleChange(user._id, "user")
                                }
                                className="text-xs cursor-pointer capitalize"
                              >
                                User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  void handleRoleChange(user._id, "moderator")
                                }
                                className="text-xs cursor-pointer capitalize"
                              >
                                Moderator
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  void handleRoleChange(user._id, "admin")
                                }
                                className="text-xs cursor-pointer capitalize"
                              >
                                Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="capitalize text-xs md:text-sm font-semibold text-muted-foreground">
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user.isBanned ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                              title="Mở khóa tài khoản"
                              onClick={() => handleActionClick("unban", user)}
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                              title="Khóa tài khoản"
                              onClick={() => handleActionClick("ban", user)}
                              disabled={user._id === currentUser?._id}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            title="Xóa vĩnh viễn"
                            onClick={() => handleActionClick("delete", user)}
                            disabled={user._id === currentUser?._id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalCount={filteredUsers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen) =>
          !isOpen && setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
      >
        <DialogContent className="sm:max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Xác nhận hành động
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              {confirmDialog.type === "ban" &&
                `Bạn có chắc chắn muốn khóa tài khoản của ${confirmDialog.user?.displayName}? Người dùng này sẽ bị hủy phiên làm việc và không thể đăng nhập.`}
              {confirmDialog.type === "unban" &&
                `Bạn có chắc chắn muốn mở khóa tài khoản cho ${confirmDialog.user?.displayName}?`}
              {confirmDialog.type === "delete" &&
                `Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của ${confirmDialog.user?.displayName}? Toàn bộ lịch sử trò chuyện trực tiếp liên quan sẽ bị xóa.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ ...confirmDialog, isOpen: false })
              }
              className="text-xs h-9 border-border/40"
            >
              Hủy
            </Button>
            <Button
              variant={
                confirmDialog.type === "delete" || confirmDialog.type === "ban"
                  ? "destructive"
                  : "default"
              }
              onClick={() => void handleConfirmAction()}
              className="text-xs h-9"
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
