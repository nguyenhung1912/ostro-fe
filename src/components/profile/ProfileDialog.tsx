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
      <DialogContent className="overflow-y-auto max-h-[95vh] p-0 bg-background border-[3px] border-black shadow-[8px_8px_0px_0px_var(--shadow-color)] max-w-3xl">
        <div className="w-full">
          <div className="mx-auto p-4 sm:p-5">
            {/* heading */}
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
                Profile & Settings
              </DialogTitle>
            </DialogHeader>

            <ProfileCard user={user} />

            <Tabs defaultValue="personal" className="my-4">
              <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-card border-[3px] border-black p-1 rounded-none shadow-[2px_2px_0px_0px_var(--shadow-color)] h-12">
                <TabsTrigger
                  value="personal"
                  className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:border-[2px] data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0px_0px_var(--shadow-color)] font-bold transition-all border-[2px] border-transparent h-full text-foreground"
                >
                  Tài Khoản
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:border-[2px] data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0px_0px_var(--shadow-color)] font-bold transition-all border-[2px] border-transparent h-full text-foreground"
                >
                  Cấu Hình
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:border-[2px] data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0px_0px_var(--shadow-color)] font-bold transition-all border-[2px] border-transparent h-full text-foreground"
                >
                  Bảo Mật
                </TabsTrigger>
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
