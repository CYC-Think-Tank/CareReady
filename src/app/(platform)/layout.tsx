import { PlatformShell } from "@/components/platform-shell";
import { getViewer } from "@/lib/viewer";

export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  return <PlatformShell viewer={viewer}>{children}</PlatformShell>;
}

