import Link from "next/link";
import { CheckCircle, PersonStanding, Share, Wallet } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 border-b border-white/10 dark:border-[#283930]">
        <div className="flex items-center gap-4 text-black dark:text-white">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">ReferEarn</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-9">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#features">How it Works</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#plans">Pricing</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#footer">Contact</a>
          </div>
          <Link href="/login" className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold hover:opacity-90 transition-opacity">
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-10 md:py-20 px-4">
          <div className="max-w-[960px] mx-auto">
            <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-lg items-center justify-center p-4 text-center"
              style={{ backgroundImage: 'linear-gradient(rgba(16, 34, 25, 0.8) 0%, rgba(16, 34, 25, 0.95) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNbUWEIJmOR2aGupgy7iQy7wtKdK_4SlIe8ECbm0gLGmL9bK0rjYRU4U4kVVOs6iD3UXHtGYyiEeQCWWRCYV9KcwqJXaWxHzMms4E-c1PTmG9UAHmnkmZcaAGj7Et3Aul_VdtLdqWxciMKRb9knn3zYVet4sdcLAhIkQVfuhDfOmTi0mTrWKCgg5xrV-QoI0MoEuZP3G_1gwl-wuuif0ohymjs-up6fHu31zE--jsJ1aP2MG30QRcH15ilj2udDeEJLXEZhZeo4Lir")' }}>
              <div className="flex flex-col gap-4 max-w-2xl">
                <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
                  Earn Up To <span className="text-primary">$5  USD</span> Per task  and 50% on Referral Bonus
                </h1>
                <h2 className="text-white/80 text-base md:text-lg font-normal">
                  Join our network and start building your financial future today. Turn your connections into cash.
                </h2>
              </div>
              <Link href="/signup?plan=lite" className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-background-dark text-base md:text-lg font-bold hover:opacity-90 transition-opacity">
                Start Earning Now
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-10 px-4">
          <div className="max-w-[960px] mx-auto flex flex-col gap-10">
            <div className="text-center flex flex-col gap-4 items-center">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-[-0.033em]">Multiple Ways to Earn</h2>
              <p className="text-black/70 dark:text-white/70 text-base max-w-[720px]">
                Our platform offers diverse opportunities. Get rewarded for referrals and for your time.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-4 rounded-lg border border-black/10 dark:border-[#3b5447] bg-white dark:bg-[#1c2721] p-6">
                <PersonStanding className="text-primary size-10" />
                <div>
                  <h3 className="text-lg font-bold">1. Sign Up</h3>
                  <p className="text-sm text-black/70 dark:text-[#9db9ab]">Choose the plan that's right for you and create your account in minutes.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-lg border border-black/10 dark:border-[#3b5447] bg-white dark:bg-[#1c2721] p-6">
                <Share className="text-primary size-10" />
                <div>
                  <h3 className="text-lg font-bold">2. Refer Friends</h3>
                  <p className="text-sm text-black/70 dark:text-[#9db9ab]">Share your unique referral link with your network through social media.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-lg border border-black/10 dark:border-[#3b5447] bg-white dark:bg-[#1c2721] p-6">
                <Wallet className="text-primary size-10" />
                <div>
                  <h3 className="text-lg font-bold">3. Earn 50%</h3>
                  <p className="text-sm text-black/70 dark:text-[#9db9ab]">Receive a 50% commission for every single person who signs up using your link.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-lg border border-black/10 dark:border-[#3b5447] bg-white dark:bg-[#1c2721] p-6">
                <Wallet className="text-primary size-10" />
                <div>
                  <h3 className="text-lg font-bold">4. Earn From Tasks</h3>
                  <p className="text-sm text-black/70 dark:text-[#9db9ab]">Earn Up To $5 USD Per task.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-lg border border-black/10 dark:border-[#3b5447] bg-white dark:bg-[#1c2721] p-6">
                <Wallet className="text-primary size-10" />
                <div>
                  <h3 className="text-lg font-bold">5. Place ADS for people and earn commission</h3>
                  <p className="text-sm text-black/70 dark:text-[#9db9ab]">Earn 10% commission from every Advert placed by you.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-lg border border-black/10 dark:border-[#3b5447] bg-white dark:bg-[#1c2721] p-6">
                <Wallet className="text-primary size-10" />
                <div>
                  <h3 className="text-lg font-bold">6. Earn from Guiders Credits</h3>
                  <p className="text-sm text-black/70 dark:text-[#9db9ab]">Become a guider and earn 10% commission from every Credit purchased by users.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="plans" className="py-10 px-4">
          <div className="max-w-[960px] mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lite Plan */}
              <div className="flex flex-col gap-6 rounded-lg border border-black/10 dark:border-[#3b5447] bg-white dark:bg-[#1c2721] p-6">
                <div>
                  <h3 className="text-lg font-bold">Lite</h3>
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black">$12</span>
                    <span className="text-sm opacity-70">per signup</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Basic Dashboard Access</div>
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Standard Support</div>
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Up to 50 Referrals</div>
                </div>
                <Link href="/signup?plan=lite" className="mt-auto w-full h-12 flex items-center justify-center rounded-lg bg-black/5 dark:bg-[#283930] font-bold hover:bg-black/10 transition-colors">Choose Plan</Link>
              </div>

              {/* Pro Plan */}
              <div className="flex flex-col gap-6 rounded-lg border-2 border-primary bg-white dark:bg-[#1c2721] p-6 relative">
                <span className="absolute -top-4 right-6 bg-primary text-background-dark text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                <div>
                  <h3 className="text-lg font-bold">Pro</h3>
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black">$21</span>
                    <span className="text-sm opacity-70">per signup</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Advanced Dashboard</div>
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Fast Payout</div>
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" />High pay per task</div>
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Marketing Toolkit</div>
                </div>
                <Link href="/signup?plan=pro" className="mt-auto w-full h-12 flex items-center justify-center rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-opacity">Choose Plan</Link>
              </div>

              {/* Premium Plan */}
              <div className="flex flex-col gap-6 rounded-lg border border-black/10 dark:border-[#3b5447] bg-white dark:bg-[#1c2721] p-6">
                <div>
                  <h3 className="text-lg font-bold">Premium</h3>
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black">$50</span>
                    <span className="text-sm opacity-70">per signup</span>
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Premium Dashboard</div>
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Fastest Payout</div>
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Highest pay per task</div>
                  <div className="flex gap-3 items-center text-sm"><CheckCircle className="text-primary size-5" /> Early Access to new features</div>
                </div>
                <Link href="/signup?plan=premium" className="mt-auto w-full h-12 flex items-center justify-center rounded-lg bg-black/5 dark:bg-[#283930] font-bold hover:bg-black/10 transition-colors">Choose Plan</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t border-black/10 dark:border-white/10 mt-10 py-8">
        <div className="max-w-[960px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-5 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
              </svg>
            </div>
            <p className="text-sm opacity-70">© 2024 ReferEarn. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm opacity-70 hover:text-primary">Terms</a>
            <a href="#" className="text-sm opacity-70 hover:text-primary">Privacy</a>
            <a href="#" className="text-sm opacity-70 hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
