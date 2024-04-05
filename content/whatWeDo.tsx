import { Icons } from "@/components/Icons";
import { ReactNode } from "react";

type WhatWeDo = {
  title: string;
  icon?: ReactNode;
};

export const WHAT_WE_DO: WhatWeDo[] = [
  {
    title: "Prove that you received a private message",
    icon: <Icons.GeometricPattern1 />,
  },
  {
    title: "Prove the contents of a website from a moment in time",
    icon: <Icons.GeometricPattern2 />,
  },
  {
    title: "Prove personal information (e.g. address, birth date, health data)",
    icon: <Icons.GeometricPattern3 />,
  },
  {
    title: "Prove you have a professional certification",
    icon: <Icons.GeometricPattern4 />,
  },
  {
    title: "Prove a financial transaction without revealing credentials",
    icon: <Icons.GeometricPattern5 />,
  },
];
