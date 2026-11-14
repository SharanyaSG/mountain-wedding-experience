import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/plan-your-trip")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "plan-your-trip" });
  },
});
