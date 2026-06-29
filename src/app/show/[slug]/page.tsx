import { getShowBySlug } from "@/app/actions/getShowBySlug";
import ShowPage from "@/components/pages/ShowPage";
import { getCurrentUser } from "@/lib/auth";

export default async function Show({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const show = await getShowBySlug(slug);
  return <ShowPage show={show} user={user} />;
}
