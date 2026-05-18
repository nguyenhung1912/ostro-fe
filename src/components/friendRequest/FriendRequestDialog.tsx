import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceivedRequests from "./ReceivedRequests";
import SentRequests from "./SentRequests";

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const [tab, setTab] = useState("received");
  const { getAllFriendRequest } = useFriendStore();

  useEffect(() => {
    if (!open) return;

    const loadRequest = async () => {
      try {
        await getAllFriendRequest();
      } catch (error) {
        console.error("Lỗi khi load requests", error);
      }
    };

    loadRequest();
  }, [getAllFriendRequest, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-black text-2xl uppercase tracking-tight text-foreground">
            Lời mời kết bạn
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-card border-[3px] border-black p-1 rounded-none shadow-[2px_2px_0px_0px_var(--shadow-color)] h-12">
            <TabsTrigger
              value="received"
              className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:border-[2px] data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0px_0px_var(--shadow-color)] font-bold transition-all border-[2px] border-transparent h-full text-foreground"
            >
              Đã nhận
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:border-[2px] data-[state=active]:border-black data-[state=active]:shadow-[2px_2px_0px_0px_var(--shadow-color)] font-bold transition-all border-[2px] border-transparent h-full text-foreground"
            >
              Đã gửi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            <ReceivedRequests />
          </TabsContent>

          <TabsContent value="sent">
            <SentRequests />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
