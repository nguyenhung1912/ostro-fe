import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import type { AdminGroup } from "@/services/adminService";
import { sileo } from "sileo";
import {
  Search,
  Trash2,
  ShieldAlert,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";

export function GroupManagement() {
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    group: AdminGroup | null;
  }>({
    isOpen: false,
    group: null,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search]);

  const loadGroups = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      }
      const data = await adminService.fetchGroups();
      setGroups(data);
    } catch {
      sileo.error({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách phòng/nhóm từ hệ thống.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGroups(false);
  }, []);

  const handleDeleteClick = (group: AdminGroup) => {
    setConfirmDelete({
      isOpen: true,
      group,
    });
  };

  const handleConfirmDelete = async () => {
    const { group } = confirmDelete;
    if (!group) return;

    try {
      await adminService.deleteGroup(group._id);
      sileo.success({
        title: "Xóa nhóm thành công",
        description: `Đã xóa nhóm "${group.group.name}" và toàn bộ tin nhắn liên quan.`,
      });
      void loadGroups();
    } catch {
      sileo.error({
        title: "Lỗi xóa nhóm",
        description: "Gặp sự cố khi thực hiện yêu cầu. Vui lòng thử lại.",
      });
    } finally {
      setConfirmDelete({ isOpen: false, group: null });
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.group.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    const totalPages = Math.ceil(filteredGroups.length / pageSize);
    if (currentPage > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [filteredGroups.length, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Controls: Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm nhóm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full"
          />
        </div>
      </div>

      {/* Groups Grid / Table */}
      <div className="rounded-xl border border-border/45 bg-card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Đang tải danh sách phòng/nhóm...
            </span>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
            <span className="text-sm">Không tìm thấy phòng hoặc nhóm nào.</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto beautiful-scrollbar">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-secondary/15 text-xs text-muted-foreground uppercase font-semibold">
                    <th className="px-6 py-4">Tên nhóm</th>
                    <th className="px-6 py-4">Người tạo</th>
                    <th className="px-6 py-4">Số thành viên</th>
                    <th className="px-6 py-4">Thành viên</th>
                    <th className="px-6 py-4">Ngày tạo</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {paginatedGroups.map((group) => {
                    const memberCount = group.participants?.length || 0;
                    const displayParticipants =
                      group.participants?.slice(0, 3) || [];
                    const extraCount = memberCount > 3 ? memberCount - 3 : 0;
                    const createdDate = group.createdAt
                      ? new Date(group.createdAt).toLocaleDateString("vi-VN")
                      : "-";

                    return (
                      <tr
                        key={group._id}
                        className="hover:bg-secondary/5 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {group.group.name || "Nhóm không tên"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {group.group.createdBy?.displayName ||
                            group.group.createdBy?.username ||
                            "Hệ thống"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">
                          {memberCount} thành viên
                        </td>
                        <td className="px-6 py-4">
                          <AvatarGroup>
                            {displayParticipants.map((p) => (
                              <Avatar key={p.userId?._id} size="sm">
                                <AvatarImage src={p.userId?.avatarUrl} />
                                <AvatarFallback>
                                  {p.userId?.displayName
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {extraCount > 0 && (
                              <AvatarGroupCount>+{extraCount}</AvatarGroupCount>
                            )}
                          </AvatarGroup>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {createdDate}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            title="Xóa nhóm"
                            onClick={() => handleDeleteClick(group)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalCount={filteredGroups.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Delete Group Dialog */}
      <Dialog
        open={confirmDelete.isOpen}
        onOpenChange={(isOpen) =>
          !isOpen && setConfirmDelete({ ...confirmDelete, isOpen: false })
        }
      >
        <DialogContent className="sm:max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Cảnh báo xóa nhóm
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              Bạn có chắc chắn muốn xóa nhóm{" "}
              <strong className="text-foreground">
                "{confirmDelete.group?.group.name}"
              </strong>
              ? Hành động này sẽ giải tán nhóm và xóa toàn bộ tin nhắn liên
              quan. Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete({ isOpen: false, group: null })}
              className="text-xs h-9 border-border/40"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleConfirmDelete()}
              className="text-xs h-9"
            >
              Xóa nhóm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
