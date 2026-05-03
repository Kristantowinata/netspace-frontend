"use client";

import React from "react";

interface ProfileAvatarProps {
  size?: number;
}

export default function ProfileAvatar({ size = 88 }: ProfileAvatarProps) {
  return (
    <div className="profile-avatar">
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="profile-avatar__icon"
      >
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>

      <style jsx>{`
        .profile-avatar {
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 3px rgba(56, 100, 255, 0.3),
            0 8px 24px rgba(56, 100, 255, 0.35);
        }

        .profile-avatar__icon {
          width: ${size * 0.55}px;
          height: ${size * 0.55}px;
          fill: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
}
