import { getShowBySlug } from "@/app/actions/getShowBySlug";
import ShowLayout from "@/components/layouts/ShowLayout";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const show = await getShowBySlug(slug);
  return <ShowLayout show={show} user={user} />;
}
