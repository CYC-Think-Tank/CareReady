import { PlatformShell } from "@/components/platform-shell";
import { getCourseModules, getFirstLessonHref } from "@/lib/modules";
import { getViewer } from "@/lib/viewer";

export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();
  const coursesHref = getFirstLessonHref(await getCourseModules());

  return (
    <PlatformShell viewer={viewer} coursesHref={coursesHref}>
      {children}
    </PlatformShell>
  );
}
