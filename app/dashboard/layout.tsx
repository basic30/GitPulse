import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | GitPulse",
  description: "Manage and analyze your GitHub repositories",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
