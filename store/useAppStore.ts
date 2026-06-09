import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Interest {
  emoji: string;
  label: string;
}

// A user this session has blocked. We keep name + emoji (not just the id) so the
// Profile "Diblokir" section can show who they are and offer an unblock.
export interface BlockedUser {
  id: string;
  name: string;
  emoji: string;
}

interface GroupInfo {
  name: string;
  iAmHost: boolean;
}

interface AppState {
  // Identity
  name: string;
  age: string;
  gender: string | null;
  occupation: string;

  // Interests
  interests: Interest[];

  // Location (from QR scan URL)
  location: string;
  locationName: string;

  // Auth (JWT issued by backend on check-in)
  sessionToken: string;

  // Own identity issued by the backend on check-in
  userId: string;
  userSlug: string;

  // Group registry — groups are WebSocket-only (no REST snapshot), so we
  // remember each group's name + whether we host it as we navigate into them.
  groups: Record<string, GroupInfo>;

  // Users blocked for this session — their messages are filtered out client-side
  // and they're hidden from every list. blockedIds is the fast lookup used by
  // those filters; blockedUsers carries the display detail for the Profile
  // "Diblokir" section. The two are always kept in sync.
  blockedIds: string[];
  blockedUsers: BlockedUser[];

  // Ephemeral UI flag (not persisted): a notification arrived while the user
  // wasn't on the Profile tab, so the BottomNav shows an unread dot there.
  hasUnreadNotif: boolean;

  // Ephemeral (not persisted): count of public-room messages that arrived while
  // the user wasn't in the public room, surfaced as an unread badge on the
  // Public Room card. Reset to 0 when they open the room.
  unreadPublic: number;

  // Actions
  setIdentity: (
    name: string,
    age: string,
    gender: string,
    occupation: string
  ) => void;
  setInterests: (interests: Interest[]) => void;
  setLocation: (slug: string) => void;
  setSessionToken: (token: string) => void;
  setSession: (token: string, userId: string, userSlug: string) => void;
  setGroup: (groupId: string, info: GroupInfo) => void;
  renameGroup: (groupId: string, name: string) => void;
  blockUser: (user: BlockedUser) => void;
  unblockUser: (userId: string) => void;
  setUnreadNotif: (value: boolean) => void;
  bumpUnreadPublic: () => void;
  clearUnreadPublic: () => void;
  reset: () => void;
}

function formatLocationName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const initialState = {
  name: "",
  age: "",
  gender: null as string | null,
  occupation: "",
  interests: [] as Interest[],
  location: "",
  locationName: "",
  sessionToken: "",
  userId: "",
  userSlug: "",
  groups: {} as Record<string, GroupInfo>,
  blockedIds: [] as string[],
  blockedUsers: [] as BlockedUser[],
  hasUnreadNotif: false,
  unreadPublic: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setIdentity: (name, age, gender, occupation) =>
        set({ name, age, gender, occupation }),

      setInterests: (interests) => set({ interests }),

      setLocation: (slug) =>
        set({
          location: slug,
          locationName: formatLocationName(slug),
        }),

      setSessionToken: (token) => set({ sessionToken: token }),

      setSession: (token, userId, userSlug) =>
        set({ sessionToken: token, userId, userSlug }),

      setGroup: (groupId, info) =>
        set((state) => ({ groups: { ...state.groups, [groupId]: info } })),

      renameGroup: (groupId, name) =>
        set((state) => ({
          groups: {
            ...state.groups,
            [groupId]: {
              name,
              iAmHost: state.groups[groupId]?.iAmHost ?? false,
            },
          },
        })),

      blockUser: (user) =>
        set((state) =>
          state.blockedIds.includes(user.id)
            ? state
            : {
                blockedIds: [...state.blockedIds, user.id],
                blockedUsers: [...state.blockedUsers, user],
              }
        ),

      unblockUser: (userId) =>
        set((state) => ({
          blockedIds: state.blockedIds.filter((id) => id !== userId),
          blockedUsers: state.blockedUsers.filter((u) => u.id !== userId),
        })),

      setUnreadNotif: (value) => set({ hasUnreadNotif: value }),

      bumpUnreadPublic: () =>
        set((state) => ({ unreadPublic: state.unreadPublic + 1 })),

      clearUnreadPublic: () => set({ unreadPublic: 0 }),

      reset: () =>
        set({
          ...initialState,
          groups: {},
          blockedIds: [],
          blockedUsers: [],
          hasUnreadNotif: false,
          unreadPublic: 0,
        }),
    }),
    {
      name: "social-hub-session",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist data fields, not action functions
      partialize: (state) => ({
        name: state.name,
        age: state.age,
        gender: state.gender,
        occupation: state.occupation,
        interests: state.interests,
        location: state.location,
        locationName: state.locationName,
        sessionToken: state.sessionToken,
        userId: state.userId,
        userSlug: state.userSlug,
        groups: state.groups,
        blockedIds: state.blockedIds,
        blockedUsers: state.blockedUsers,
      }),
    }
  )
);
