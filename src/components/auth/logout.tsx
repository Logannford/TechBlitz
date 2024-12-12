'use client';
import { logout } from '@/actions/user/account/logout';
import { useRouter } from 'next/navigation';

import { ExitIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function LogoutButton(otps: {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
  padding?: 'sm' | 'lg' | 'md' | 'xl' | 'none' | null | undefined;
}) {
  const { variant = 'default', padding = 'md' } = otps;

  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
    toast.success('You have been logged out');
  };

  return (
    <Button
      className="flex items-center gap-x-2 h-auto hover:text-white"
      variant={variant}
      onClick={handleLogout}
      padding={padding}
      type="button"
    >
      <p className="text-sm">Logout</p>
      <ExitIcon className="size-3" />
    </Button>
  );
}