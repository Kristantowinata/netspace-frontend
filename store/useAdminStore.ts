import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminState {
  isAuthenticated: boolean;
  adminName: string;
  adminRole: string;
  adminPlan: string;
  adminAvatar: string;
  token: string;

  // Actions
  login: (name: string, role: string, plan: string, avatar: string, token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminName: "",
      adminRole: "",
      adminPlan: "",
      adminAvatar: "",
      token: "",

      login: (name, role, plan, avatar, token) =>
        set({
          isAuthenticated: true,
          adminName: name,
          adminRole: role,
          adminPlan: plan,
          adminAvatar: avatar,
          token,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          adminName: "",
          adminRole: "",
          adminPlan: "",
          adminAvatar: "",
          token: "",
        }),
    }),
    {
      name: "netspace-admin-session",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        adminName: state.adminName,
        adminRole: state.adminRole,
        adminPlan: state.adminPlan,
        adminAvatar: state.adminAvatar,
        token: state.token,
      } as AdminState),
    }
  )
);
