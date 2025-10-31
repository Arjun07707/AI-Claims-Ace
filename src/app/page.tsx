import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import LandingHeader from '@/components/landing-header';

export default function Home() {
  const heroImage = PlaceHolderImages.find(
    (image) => image.id === 'hero-illustration'
  );

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Simplify your claims with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl font-body">
                    Fast. Accurate. Hassle-Free. Let our smart assistant handle
                    the paperwork, so you can focus on what matters.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">File a Claim</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/login">Track My Claim</Link>
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={600}
                  height={400}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-2xl"
                />
              )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A Smarter Way to Manage Claims
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
                  Our AI-powered platform streamlines every step of the claims
                  process, from filing to resolution.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">Conversational Filing</h3>
                <p className="text-sm text-muted-foreground">
                  Just tell our chatbot what happened. It understands, asks the
                  right questions, and files the claim for you.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">Document Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  Upload invoices, reports, or photos. Our AI reads them and
                  auto-fills the details, saving you time.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">Real-Time Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  No more waiting on hold. Get instant, AI-generated updates on
                  your claim's status anytime.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">Predictive Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Gain clarity with AI-powered predictions on approval
                  likelihood and estimated settlement times.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">Fraud Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Our system helps ensure fairness and accuracy by flagging
                  inconsistencies for review.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">Admin Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  A powerful dashboard for staff to efficiently manage, review,
                  and process all claims.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center w-full h-20 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AI Claims Ace. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
