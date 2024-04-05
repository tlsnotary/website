import { classed } from "@tw-classed/react";

export const AppContainer = classed.div("px-6 mx-auto w-full", {
  variants: {
    size: {
      small: "max-w-[700px] md:px-0",
      medium: "max-w-screen-2xl md:px-16",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});
