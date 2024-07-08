import React from "react";
import { isGoogleAuthEnabled } from "./google/google-config";
import { GoogleSignIn, GoogleSignUp } from "./google/google-auth";

interface SocialAuthProps {
  isLogin: boolean;
  redirectTo?: string;
}

export default function SocialAuth({ isLogin, redirectTo }: SocialAuthProps) {
  return (
    <div className="!ml-0">
      {isGoogleAuthEnabled && isLogin ? (
        <GoogleSignIn redirectTo={redirectTo} />
      ) : (
        <GoogleSignUp redirectTo={redirectTo} />
      )}
    </div>
  );
}
