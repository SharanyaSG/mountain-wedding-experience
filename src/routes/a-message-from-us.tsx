import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/a-message-from-us")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "message-from-us" });
  },
});
