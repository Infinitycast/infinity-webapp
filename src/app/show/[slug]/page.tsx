import { getShowBySlug } from "@/app/actions/getShowBySlug";
import ShowLayout from "@/components/layouts/ShowLayout";
import { getCurrentUser } from "@/lib/auth";

export default async function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const show = await getShowBySlug(slug);
  return <ShowLayout show={show} user={user} />;
}
