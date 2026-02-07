"use client";

import { LogsViewer } from "@/components/logs";
import { CronManager } from "@/components/cron";

export default function LogsPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <LogsViewer />
      <CronManager />
    </div>
  );
}
