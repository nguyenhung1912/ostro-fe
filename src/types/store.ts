import { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, FriendRequest, User } from "./user";

export interface AccessTokenResponse {
  accessToken: string;
}

export interface FetchMeResponse {
  user: User;
}

export interface FetchMeOptions {
  showErrorToast?: boolean;
}

export interface RefreshOptions {
  showErrorToast?: boolean;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  authChecked: boolean;

  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  clearState: () => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<boolean>;
  signIn: (username: string, password: string) => Promise<boolean>;
  signInWithGoogle: (credential: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  fetchMe: (options?: FetchMeOptions) => Promise<boolean>;
  refresh: (options?: RefreshOptions) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean;
      nextCursor?: string | null;
    }
  >;
  activeConversationId: string | null;
  convoLoading: boolean;
  messageLoading: boolean;
  loading: boolean;
  reset: () => void;

  setActiveConversation: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId?: string) => Promise<void>;
  sendDirectMessage: (
    receipientId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content: string,
    imgUrl?: string,
  ) => Promise<void>;
  recallMessage: (messageId: string, conversationId: string) => Promise<void>;
  markMessageRecalled: (
    messageId: string,
    conversationId: string,
    lastMessage?: Conversation["lastMessage"],
  ) => void;
  // add message
  addMessage: (message: Message) => Promise<void>;
  // update conversation
  updateConversation: (
    conversation: Partial<Conversation> & { _id: string },
  ) => void;
  markAsSeen: () => Promise<void>;
  addConvo: (convo: Conversation) => void;
  createConversation: (
    type: "group" | "direct",
    name: string,
    memberIds: string[],
  ) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  leaveGroup: (conversationId: string) => Promise<void>;
  removeConversation: (conversationId: string) => void;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  friends: Friend[];
  loading: boolean;
  receivedList: FriendRequest[];
  sentList: FriendRequest[];
  searchByUsername: (username: string) => Promise<User | null>;
  addFriend: (to: string, message?: string) => Promise<string>;
  getAllFriendRequest: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  getFriends: () => Promise<void>;
}

export interface UserState {
  updateAvatarUrl: (formData: FormData) => Promise<void>;
  updateCoverUrl: (formData: FormData) => Promise<void>;
  updateProfile: (payload: {
    displayName: string;
    bio?: string;
    phone?: string;
  }) => Promise<void>;
  changePassword: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}
