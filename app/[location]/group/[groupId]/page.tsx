"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import BottomNav from "@/components/layout/BottomNav";
import GroupChatHeader from "@/components/ui/GroupChatHeader";
import GroupMembersBar from "@/components/ui/GroupMembersBar";
import ChatBubble from "@/components/ui/ChatBubble";
import ChatInput from "@/components/ui/ChatInput";
import ConfirmModal from "@/components/ui/ConfirmModal";
import InviteModal from "@/components/ui/InviteModal";
import { useAppStore } from "@/store/useAppStore";
import { wsClient, useWsEvent } from "@/lib/ws";
import {
  EV,
  type NewGroupMessageEvent,
  type MemberJoinedEvent,
  type MemberLeftEvent,
  type GroupDissolvedEvent,
  type GroupRenamedEvent,
  type UserDTO,
} from "@/lib/wsTypes";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmoji: string;
  message: string;
  timestamp: string;
  isMine: boolean;
}

interface GroupMember {
  id: string;
  name: string;
  emoji: string;
  isHost: boolean;
}

interface InviteUser {
  id: string;
  name: string;
  emoji: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function GroupSessionPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;
  const location = params.location as string;

  const sessionToken = useAppStore((s) => s.sessionToken);
  const myId = useAppStore((s) => s.userId);
  const myName = useAppStore((s) => s.name);
  const groupInfo = useAppStore((s) => s.groups[groupId]);
  const setGroup = useAppStore((s) => s.setGroup);
  const renameGroup = useAppStore((s) => s.renameGroup);
  const blockedIds = useAppStore((s) => s.blockedIds);

  const iAmHost = groupInfo?.iAmHost ?? true;

  // Group name lives in local state so it can come from the store (when we
  // created/opened it), the history fetch (when we arrive via the chat list),
  // or a live group_renamed event.
  const [groupName, setGroupName] = useState(
    groupInfo?.name ?? "Group Session"
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([
    { id: myId || "me", name: myName || "You", emoji: "🧑", isHost: iAmHost },
  ]);
  const [available, setAvailable] = useState<InviteUser[]>([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Incoming ──

  useWsEvent<NewGroupMessageEvent>(EV.NEW_GROUP_MESSAGE, (data) => {
    // Only messages for this group, and never from blocked users.
    if (data.groupId !== groupId) return;
    if (!data.isMine && blockedIds.includes(data.senderId)) return;
    setMessages((prev) => [
      ...prev,
      {
        id: data.id,
        senderId: data.senderId,
        senderName: data.isMine ? "You" : data.senderName,
        senderEmoji: data.senderEmoji,
        message: data.message,
        timestamp: data.timestamp,
        isMine: data.isMine,
      },
    ]);
  });

  useWsEvent<MemberJoinedEvent>(EV.MEMBER_JOINED, (data) => {
    setMembers((prev) =>
      prev.some((m) => m.id === data.id)
        ? prev
        : [
            ...prev,
            {
              id: data.id,
              name: data.name,
              emoji: data.emoji,
              isHost: data.isHost,
            },
          ]
    );
  });

  useWsEvent<MemberLeftEvent>(EV.MEMBER_LEFT, (data) => {
    setMembers((prev) => prev.filter((m) => m.id !== data.userId));
  });

  // Group dissolved (host left / too few members) → bounce out.
  useWsEvent<GroupDissolvedEvent>(EV.GROUP_DISSOLVED, (data) => {
    if (data.groupId !== groupId) return;
    router.push(`/${location}/room`);
  });

  // Someone renamed the group → update the header + the chat-list store entry.
  useWsEvent<GroupRenamedEvent>(EV.GROUP_RENAMED, (data) => {
    if (data.groupId !== groupId) return;
    setGroupName(data.name);
    renameGroup(groupId, data.name);
  });

  // Auto-scroll on new messages.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load the group summary, member roster and persisted message history.
  // The roster also serves as the join-time snapshot for users who joined
  // mid-session (they'd otherwise only see members who join after them).
  useEffect(() => {
    if (!groupId) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/groups/${groupId}/messages`, {
          headers: sessionToken
            ? { Authorization: `Bearer ${sessionToken}` }
            : undefined,
        });
        if (!res.ok) return;
        const data: {
          group: { name: string; emoji: string };
          members: GroupMember[];
          messages: ChatMessage[];
        } = await res.json();

        // Use the server's authoritative group name (covers arriving via the
        // chat list, where the store has no entry yet), and seed the store so
        // the chat list shows the right name too.
        if (data.group?.name) {
          setGroupName(data.group.name);
          if (!groupInfo) {
            setGroup(groupId, { name: data.group.name, iAmHost: false });
          }
        }

        // Merge the server roster with self; keep my host flag from the store.
        setMembers((prev) => {
          const byId = new Map<string, GroupMember>();
          for (const m of prev) byId.set(m.id, m);
          for (const m of data.members) {
            byId.set(m.id, {
              ...m,
              isHost: m.id === (myId || "me") ? iAmHost : m.isHost,
            });
          }
          return Array.from(byId.values());
        });

        // Respect session-scoped blocks even for historical messages.
        setMessages(
          (data.messages ?? []).filter(
            (m) => m.isMine || !blockedIds.includes(m.senderId)
          )
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, sessionToken]);

  // Pull the active user list so the invite sheet can offer real people.
  useEffect(() => {
    if (!location) return;
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/locations/${location}/users`, {
          headers: sessionToken
            ? { Authorization: `Bearer ${sessionToken}` }
            : undefined,
        });
        if (!res.ok) return;
        const data: { users: UserDTO[] } = await res.json();
        setAvailable(
          data.users.map((u) => ({ id: u.id, name: u.name, emoji: u.emoji }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [location, sessionToken]);

  // ── Outgoing ──

  const handleSend = (text: string) => {
    wsClient.send("send_group_message", { groupId, message: text });
  };

  const handleInvite = (userIds: string[]) => {
    if (userIds.length === 0) return;
    wsClient.send("invite_to_group", { groupId, userIds });
  };

  const handleLeave = () => {
    wsClient.send("leave_group", { groupId });
    setShowLeaveModal(false);
    router.push(`/${location}/room`);
  };

  const handleRename = () => {
    const name = renameValue.trim();
    if (!name || name === groupName) {
      setShowRenameModal(false);
      return;
    }
    wsClient.send("rename_group", { groupId, name });
    // Optimistic update; the server's group_renamed confirms for everyone.
    setGroupName(name);
    renameGroup(groupId, name);
    setShowRenameModal(false);
  };

  // Don't offer to invite people who are already members.
  const memberIds = new Set(members.map((m) => m.id));
  const inviteCandidates = available.filter((u) => !memberIds.has(u.id));

  return (
    <MobileLayout showGlow={false}>
      {/* ── Background orbs ── */}
      <div className="gs-orbs" aria-hidden="true">
        <div className="gs-orbs__blue" />
        <div className="gs-orbs__purple" />
      </div>

      {/* ── Header ── */}
      <GroupChatHeader
        groupName={groupName}
        groupEmoji="☕"
        memberCount={members.length}
        onBack={() => router.back()}
        onRename={() => {
          setRenameValue(groupName);
          setShowRenameModal(true);
        }}
      />

      {/* ── Members ── */}
      <GroupMembersBar
        members={members}
        onInvite={() => setShowInviteModal(true)}
        onLeave={() => setShowLeaveModal(true)}
      />

      {/* ── Messages ── */}
      <div className="gs-messages hide-scrollbar">
        {/* Section label */}
        <p className="gs-section-label">CHAT GRUP</p>

        {messages.length === 0 && (
          <p className="gs-empty">Belum ada pesan. Mulai obrolan grup 👋</p>
        )}

        {/* Message bubbles — with avatars in group chat */}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.message}
            timestamp={msg.timestamp}
            variant={msg.isMine ? "mine" : "other"}
            senderName={msg.senderName}
            senderEmoji={msg.senderEmoji}
            showAvatar={true}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <ChatInput onSend={handleSend} placeholder="Tulis pesan ke grup..." />

      {/* ── Bottom Nav ── */}
      <BottomNav />

      {/* ── Spacer ── */}
      <div className="gs-spacer" />

      {/* ── Leave Group Modal ── */}
      <ConfirmModal
        isOpen={showLeaveModal}
        icon="🚪"
        title="Keluar dari grup?"
        description="Kamu akan keluar dari group session ini. Pesan yang sudah dikirim tetap terlihat oleh anggota lain."
        confirmLabel="Keluar"
        variant="danger"
        onConfirm={handleLeave}
        onCancel={() => setShowLeaveModal(false)}
      />

      {/* ── Invite Modal ── */}
      <InviteModal
        isOpen={showInviteModal}
        availableUsers={inviteCandidates}
        onInvite={handleInvite}
        onClose={() => setShowInviteModal(false)}
      />

      {/* ── Rename Group Modal ── */}
      {showRenameModal && (
        <>
          <div
            className="rn-backdrop"
            onClick={() => setShowRenameModal(false)}
          />
          <div className="rn-modal">
            <div className="rn-handle" />
            <h2 className="rn-title">Ganti Nama Grup</h2>
            <input
              type="text"
              className="rn-input"
              value={renameValue}
              maxLength={40}
              autoFocus
              placeholder="Nama grup baru"
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
            />
            <div className="rn-actions">
              <button
                type="button"
                className="rn-btn rn-btn--save"
                disabled={
                  !renameValue.trim() || renameValue.trim() === groupName
                }
                onClick={handleRename}
              >
                Simpan
              </button>
              <button
                type="button"
                className="rn-btn rn-btn--cancel"
                onClick={() => setShowRenameModal(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        /* Background orbs */
        .gs-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .gs-orbs__blue {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(56, 100, 255, 0.3) 0%,
            transparent 70%
          );
          top: -50px;
          left: -50px;
        }

        .gs-orbs__purple {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(100, 60, 255, 0.25) 0%,
            transparent 70%
          );
          bottom: 100px;
          right: -40px;
        }

        /* Messages area */
        .gs-messages {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 0 14px 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        .gs-section-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.5px;
          padding: 6px 4px 2px;
        }

        .gs-empty {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          padding: 24px 20px;
        }

        /* Spacer for bottom nav */
        .gs-spacer {
          height: 64px;
          flex-shrink: 0;
        }

        /* Rename modal */
        .rn-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 100;
          animation: fadeIn 0.2s ease;
        }

        .rn-modal {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 390px;
          background: var(--bg-card);
          border-top: 1px solid var(--glass-border);
          border-radius: 24px 24px 0 0;
          padding: 12px 20px 32px;
          z-index: 101;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.25s ease;
        }

        .rn-handle {
          width: 40px;
          height: 4px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
          margin: 0 auto 16px;
        }

        .rn-title {
          font-size: 18px;
          font-weight: 800;
          color: white;
          margin-bottom: 14px;
        }

        .rn-input {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: white;
          font-size: 15px;
          font-family: inherit;
          outline: none;
        }

        .rn-input:focus {
          border-color: rgba(56, 100, 255, 0.5);
        }

        .rn-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 14px;
        }

        .rn-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          border: none;
          transition: transform 0.15s ease, opacity 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .rn-btn:active {
          transform: scale(0.97);
        }

        .rn-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .rn-btn--save {
          background: var(--gradient-brand);
          color: white;
          box-shadow: 0 4px 18px rgba(56, 100, 255, 0.35);
        }

        .rn-btn--cancel {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100%);
          }
          to {
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </MobileLayout>
  );
}
