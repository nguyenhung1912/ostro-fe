import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ProfileCard from "./ProfileCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PersonalInfoForm from "./PersonalInfoForm";
import PreferencesForm from "./PreferencesForm";
import PrivacySettings from "./PrivacySettings";

interface ProfileDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileDialog = ({ open, setOpen }: ProfileDialogProps) => {
  const { user } = useAuthStore();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-y-auto max-h-[90vh] p-0 w-full sm:max-w-2xl">
        <div className="w-full">
          <div className="mx-auto p-5 sm:p-6">
            {/* heading */}
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                Profile &amp; Settings
              </DialogTitle>
            </DialogHeader>

            <ProfileCard user={user} />

            <Tabs defaultValue="personal" className="my-5">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="personal">Tài Khoản</TabsTrigger>
                <TabsTrigger value="preferences">Cấu Hình</TabsTrigger>
                <TabsTrigger value="privacy">Bảo Mật</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalInfoForm userInfo={user} />
              </TabsContent>

              <TabsContent value="preferences">
                <PreferencesForm />
              </TabsContent>

              <TabsContent value="privacy">
                <PrivacySettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
