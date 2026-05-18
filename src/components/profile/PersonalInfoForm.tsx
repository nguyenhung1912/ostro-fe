import { Heart } from "lucide-react";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EditableField = {
  key: keyof Pick<User, "displayName" | "username" | "email" | "phone">;
  label: string;
  type?: string;
};

const PERSONAL_FIELDS: EditableField[] = [
  { key: "displayName", label: "Tên hiển thị" },
  { key: "username", label: "Tên người dùng" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Số điện thoại" },
];

type Props = {
  userInfo: User | null;
};

const PersonalInfoForm = ({ userInfo }: Props) => {
  if (!userInfo) return null;

  return (
    <Card className="rounded-2xl border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-black uppercase tracking-tight">
          <Heart className="size-5 text-primary" />
          Thông tin cá nhân
        </CardTitle>
        <CardDescription>
          Cập nhật hồ sơ chi tiết sẽ được bổ sung sau. Các trường dưới đây hiện
          ở chế độ chỉ xem.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border/30 bg-background/40 p-3 text-sm text-muted-foreground">
          Hiện tại chỉ hỗ trợ cập nhật ảnh đại diện trong thẻ hồ sơ phía trên.
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PERSONAL_FIELDS.map(({ key, label, type }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type={type ?? "text"}
                value={userInfo[key] ?? ""}
                readOnly
                className="bg-muted"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Giới thiệu</Label>
          <Textarea
            id="bio"
            rows={3}
            value={userInfo.bio ?? ""}
            readOnly
            className="bg-muted resize-none"
          />
        </div>

        <Button variant="outline" disabled className="w-full md:w-auto">
          Chỉnh sửa hồ sơ sẽ được hỗ trợ sau
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
