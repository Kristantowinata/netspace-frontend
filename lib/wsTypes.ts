// ═══════════════════════════════════════════
// NetSpace — WebSocket payload types
// These mirror the Go backend's api package (ws_events.go / dto.go)
// exactly, so the frontend and backend agree on the wire format.
// ═══════════════════════════════════════════

export interface InterestDTO {
  emoji: string;
  label: string;
}

export interface UserDTO {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  occupation: string;
  interests: InterestDTO[];
}

export interface NotificationDTO {
  id: string;
  type: string;
  emoji: string;
  avatarGradient: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  groupId?: string;
  // For "message" notifications: the sender's user id, so tapping the
  // notification can open the DM with them.
  senderId?: string;
}

export interface MessageDTO {
  id: string;
  type: "dm" | "group";
  name: string;
  emoji: string;
  avatarGradient: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  subtitle?: string;
}

// ── Server -> Client event payloads ──

export interface UserJoinedEvent {
  user: UserDTO;
}

export interface UserLeftEvent {
  userId: string;
  name: string;
}

export interface NewMessageEvent {
  id: string;
  senderId: string;
  message: string;
  timestamp: string;
  isMine: boolean;
}

export interface MessageSentEvent {
  id: string;
  timestamp: string;
}

export interface UserTypingEvent {
  userId: string;
}

export interface NewPublicMessageEvent {
  id: string;
  senderId: string;
  senderName: string;
  senderEmoji: string;
  message: string;
  timestamp: string;
  isMine: boolean;
}

export interface PublicUserTypingEvent {
  userId: string;
  name: string;
  emoji: string;
}

// new_group_message has the same shape as a public message, plus the groupId
// so the client can route it to the right group.
export interface NewGroupMessageEvent extends NewPublicMessageEvent {
  groupId: string;
}

export interface GroupCreatedEvent {
  groupId: string;
  name: string;
}

export interface MemberJoinedEvent {
  id: string;
  name: string;
  emoji: string;
  isHost: boolean;
}

export interface MemberLeftEvent {
  userId: string;
  name: string;
}

export interface GroupDissolvedEvent {
  groupId: string;
}

export interface GroupRenamedEvent {
  groupId: string;
  name: string;
}

export interface ForceLogoutEvent {
  reason?: string;
}

// Read receipt: the partner opened our chat and read our messages, so our
// bubbles in the conversation with `readerId` flip to blue double-checks.
export interface MessagesReadEvent {
  readerId: string;
}

// ── Event name constants (server -> client) ──
export const EV = {
  USER_JOINED: "user_joined",
  USER_LEFT: "user_left",
  NEW_MESSAGE: "new_message",
  MESSAGE_SENT: "message_sent",
  USER_TYPING: "user_typing",
  USER_STOPPED_TYPING: "user_stopped_typing",
  NEW_PUBLIC_MESSAGE: "new_public_message",
  PUBLIC_USER_TYPING: "public_user_typing",
  PUBLIC_USER_STOPPED_TYPING: "public_user_stopped_typing",
  NEW_GROUP_MESSAGE: "new_group_message",
  NEW_NOTIFICATION: "new_notification",
  GROUP_CREATED: "group_created",
  MEMBER_JOINED: "member_joined",
  MEMBER_LEFT: "member_left",
  GROUP_DISSOLVED: "group_dissolved",
  GROUP_RENAMED: "group_renamed",
  FORCE_LOGOUT: "force_logout",
  MESSAGES_READ: "messages_read",
} as const;
