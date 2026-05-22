import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Pro-Grade Prep
        </h1>
        <p className="text-muted text-sm mt-1">
          Access your technical interview suite.
        </p>
      </div>

      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'shadow-none p-0 w-full',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton:
              'border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-secondary transition-colors',
            socialButtonsBlockButtonText: 'text-foreground',
            dividerLine: 'bg-border',
            dividerText: 'text-muted text-xs uppercase',
            formFieldLabel: 'text-sm font-medium text-foreground',
            formFieldInput:
              'border border-border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors',
            formButtonPrimary:
              'bg-accent hover:bg-accent/90 text-white rounded-lg py-2.5 text-sm font-medium transition-colors',
            footerActionLink: 'text-accent hover:text-accent/80',
            footer: 'hidden',
          },
        }}
      />

      <p className="text-center text-sm text-muted mt-6">
        Don&apos;t have an account?{' '}
        <a
          href="/sign-up"
          className="text-accent font-medium hover:text-accent/80 transition-colors"
        >
          Start free trial
        </a>
      </p>

      <div className="mt-10 pt-6 border-t border-border-light flex items-center justify-between text-[11px] text-muted-foreground">
        <span>© 2024 IntervuAI</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
        </div>
      </div>
    </div>
  );
}
