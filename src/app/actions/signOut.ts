export async function signOut() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  window.location.href = "/auth/signin";
}
