import { checkFollowers } from "@/app/actions/checkFollowers";
import { getCreatorByUsername } from "@/app/actions/getCreatorByUsername";
import CreatorPage from "@/components/pages/CreatorPage";
import NoCreatorPage from "@/components/pages/NoCreatorPage";
import { getCurrentUser } from "@/lib/auth";

export default async function Creator({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await getCurrentUser();
  const creatorData = await getCreatorByUsername(username.toLowerCase());

  if (!creatorData) {
    return <NoCreatorPage user={user} />;
  }

  const { following, followId } = await checkFollowers(
    user?.id,
    creatorData?.id
  );

  return (
    <CreatorPage
      user={user}
      creator={creatorData}
      isFollowing={following}
      followId={followId}
    />
  );
}
