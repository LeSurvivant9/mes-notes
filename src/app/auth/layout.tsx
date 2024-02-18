import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 pointer-events-none inset-0 flex items-center justify-center text-xl text-center">
        {children}
      </div>
    </BackgroundGradientAnimation>
  );
};

export default AuthLayout;
