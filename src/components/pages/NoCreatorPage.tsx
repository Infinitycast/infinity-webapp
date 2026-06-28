"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { User } from "@/lib/auth";

export default function NoCreatorPage({ user }: { user: User }) {
  return (
    <MainLayout user={user}>
      <div className="flex w-full border-b border-border">
        <div className="mx-auto my-8 text-center">
          <h1>No Profile Exists</h1>
          <p>
            It appears the profile you're looking for doesn't exist or moved.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
