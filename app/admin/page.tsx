import { redirect } from "next/navigation";

// /admin has no content of its own: send admins to the dashboard (middleware already requires login)
export default function AdminIndex() {
  redirect("/admin/dashboard");
}
