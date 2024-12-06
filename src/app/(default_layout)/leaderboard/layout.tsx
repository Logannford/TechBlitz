import BackToDashboard from '@/components/global/back-to-dashboard';
import { Separator } from '@/components/ui/separator';

export default function LeaderboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="text-white flex flex-col gap-y-4 relative h-full">
      <div className="flex flex-col gap-y-2 w-full container">
        <BackToDashboard />
      </div>
      <Separator className="bg-black-50" />
      <div className="container">{children}</div>
    </div>
  );
}
