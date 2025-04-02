"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GithubIcon, Loader2, User2 } from "lucide-react";

export function LoginForm() {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", {
      callbackUrl: searchParams?.get("from") || "/dashboard",
    });
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    await signIn("github", {
      callbackUrl: searchParams?.get("from") || "/dashboard",
    });
  };

  return (
    <div className="grid gap-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <User2 className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
        <Button
          variant="outline"
          onClick={handleGithubSignIn}
          disabled={isGithubLoading}
        >
          {isGithubLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GithubIcon className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
      </div>
    </div>
  );
}
