import { zodResolver } from "@hookform/resolvers/zod";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/stores/useUserStore";

const profileSchema = z.object({
  displayName: z.string().trim().min(1, "Tên hiển thị là bắt buộc").max(80),
  bio: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(30).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type Props = {
  userInfo: User | null;
};

const PersonalInfoForm = ({ userInfo }: Props) => {
  const { updateProfile } = useUserStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userInfo?.displayName ?? "",
      bio: userInfo?.bio ?? "",
      phone: userInfo?.phone ?? "",
    },
  });

  useEffect(() => {
    reset({
      displayName: userInfo?.displayName ?? "",
      bio: userInfo?.bio ?? "",
      phone: userInfo?.phone ?? "",
    });
  }, [reset, userInfo]);

  if (!userInfo) return null;

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile(data);
  };

  return (
    <Card className="rounded-2xl glass">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 uppercase tracking-tight">
          <Heart className="size-5 text-primary" />
          Thông tin cá nhân
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">Tên hiển thị</Label>
              <Input id="displayName" {...register("displayName")} />
              {errors.displayName && (
                <p className="error-message">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Tên người dùng</Label>
              <Input id="username" value={userInfo.username} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={userInfo.email} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="error-message">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Giới thiệu</Label>
            <Textarea
              id="bio"
              rows={3}
              className="resize-none"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="error-message">{errors.bio.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
