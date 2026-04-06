import { getEpisodeById } from "@/app/actions/getEpisodeById";
import EpisodePage from "@/components/pages/EpisodePage";
import { getCurrentUser } from "@/lib/auth";

export default async function Episode({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const episodeData = await getEpisodeById(id);

  return <EpisodePage user={user} episodeId={id} episode={episodeData} />;
}
