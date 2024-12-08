import { getStripeProducts } from '@/actions/stripe/stripe-products';
import Logo from '@/components/global/logo';
import { PricingCard } from '@/components/payment/payment-card';
import { X } from 'lucide-react';
import Link from 'next/link';

export default async function UpgradePage() {
  // get the products
  const products = await getStripeProducts();

  return (
    <div className="relative bg-dot-white/[0.2]">
      <Link
        href="/dashboard"
        className="absolute top-8 left-8 z-50"
        aria-label="Go back to dashboard"
      >
        <Logo />
      </Link>
      <Link
        href="/dashboard"
        className="font-semibold top-5 right-5 absolute font-satoshi text-2xl z-30 hover:text-white/80 duration-300"
      >
        <X className="size-5" />
      </Link>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="w-full h-svh flex flex-col py-8 container z-50 relative items-center justify-center">
        <h1 className="text-3xl lg:text-5xl text-center">
          Simple and affordable <br /> pricing plans
        </h1>

        <div className="flex flex-col w-full mt-6">
          <p className="font-satoshi text-center text-lg font-semibold">
            Upgrade your account to unlock premium features, plans tailored to
            you.
          </p>
          <div className="flex gap-10 justify-center mt-16 px-10">
            {products?.map((product) => (
              <PricingCard
                key={product.id}
                product={product}
                isLoading={false}
                billingPeriod="month"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
