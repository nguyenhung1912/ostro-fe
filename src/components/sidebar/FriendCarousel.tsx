import React, { useEffect, useRef, useState } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import { useChatStore } from "@/stores/useChatStore";
import UserAvatar from "../chat/UserAvatar";
import { Users } from "lucide-react";

const FriendCarousel = () => {
  const { friends, getFriends } = useFriendStore();
  const { createConversation } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const isHoveredOrDragged = useRef(false);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    let direction = 1; // 1 for right, -1 for left
    const speed = 0.5;

    const scroll = () => {
      if (!container) return;

      if (!isHoveredOrDragged.current) {
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 1
        ) {
          direction = -1;
        } else if (container.scrollLeft <= 0) {
          direction = 1;
        }
        container.scrollLeft += speed * direction;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [friends.length]);

  const handleAddConversation = async (friendId: string) => {
    if (isDragging) return; // Prevent click while dragging
    await createConversation("direct", "", [friendId]);
  };

  const handleMouseEnter = () => {
    isHoveredOrDragged.current = true;
  };

  const handleMouseLeaveContainer = () => {
    isHoveredOrDragged.current = false;
    setIsDragging(false);
  };

  const handleTouchStart = () => {
    isHoveredOrDragged.current = true;
  };

  const handleTouchEnd = () => {
    isHoveredOrDragged.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    isHoveredOrDragged.current = true;
    if (!scrollRef.current) return;
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  if (!friends || friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-muted-foreground border border-dashed border-border bg-background rounded-2xl mb-2">
        <Users className="size-6 mb-2 opacity-50" />
        <span className="text-xs">Chưa có bạn bè</span>
      </div>
    );
  }

  return (
    <div className="relative w-full mb-2 overflow-hidden rounded-2xl bg-background p-2 border border-border">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto beautiful-scrollbar no-scrollbar select-none py-2 px-1 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeaveContainer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {friends.map((friend) => (
          <div
            key={friend._id}
            onClick={() => handleAddConversation(friend._id)}
            className="flex flex-col items-center gap-1 min-w-[60px] group flex-shrink-0 transition-transform active:scale-95"
            draggable={false}
          >
            <div className="relative p-[2px] rounded-full border border-border bg-transparent group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300">
              <div className="bg-transparent rounded-full p-[2px]">
                <UserAvatar
                  type="sidebar"
                  name={friend.displayName}
                  avatarUrl={friend.avatarUrl}
                  className="size-11 pointer-events-none"
                />
              </div>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground truncate w-full text-center group-hover:text-foreground transition-colors pointer-events-none">
              {friend.displayName.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none rounded-l-2xl"></div>
      <div className="absolute right-0 top-0 bottom-0 w-4 pointer-events-none rounded-r-2xl"></div>
    </div>
  );
};

export default FriendCarousel;
