"use client";

import { signOut } from "next-auth/react";

const estilo: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.5rem 1rem",
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
};

export default function LogoutButton() {
  return (
    <button
      style={estilo}
      onClick={() => signOut({ callbackUrl: "/" })}
      type="button"
    >
      Sair
    </button>
  );
}
