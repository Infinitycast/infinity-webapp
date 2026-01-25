import { MainLayout } from "@/components/layouts/MainLayout";
import { Footer } from "@/components/layouts/Footer";

import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div>
      <MainLayout user={user}>
        <div className="bg-background">
          {user ? (
            <section className="py-16 bg-muted/20">
              <div className="container mx-auto px-4">
                You're now signed in as {user.first_name}!
              </div>
            </section>
          ) : (
            <section className="py-16">
              <div className="container mx-auto px-4">
                Welcome to InfinityCast (alpha)
              </div>
            </section>
          )}

          <Footer />
        </div>
      </MainLayout>
    </div>
  );
}
