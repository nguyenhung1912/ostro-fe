import { Heart } from "lucide-react";
import type { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="rounded-2xl glass">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-black uppercase tracking-tight">
          <Heart className="size-5 text-primary" />
          Thông tin cá nhân
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PERSONAL_FIELDS.map(({ key, label, type }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type={type ?? "text"}
                value={userInfo[key] ?? ""}
                readOnly
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
            className="resize-none"
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
