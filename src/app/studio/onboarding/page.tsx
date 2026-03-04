import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { isUserCreator } from "@/app/actions/isUserCreator";

import CreatorOnboarding from "@/components/studio/CreatorOnboarding";

export default async function StudioOnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const isCreator = await isUserCreator({ userId: user?.id });

  if (isCreator === true) {
    redirect("/studio");
  }

  return <CreatorOnboarding user={user} />;
}
