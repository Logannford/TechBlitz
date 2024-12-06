'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputWithLabel } from '@/components/ui/input-label';
import { addToWaitlist } from '@/actions/waitlist/add';
import { toast } from 'sonner';
import posthog from 'posthog-js';

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      await addToWaitlist(email);
      setIsSubmitting(false);
      toast.success('You have been added to the waitlist!');

      posthog.capture('waitlist_signup', { email });
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Failed to add you to the waitlist. Please try again');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-end gap-4 w-full max-w-md justify-center"
    >
      <InputWithLabel
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Email Address"
        wrapperclassname="w-full"
      />
      <Button fullWidth variant="accent" disabled={isSubmitting}>
        {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
      </Button>
    </form>
  );
}
