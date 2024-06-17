import { classed } from "@tw-classed/react";

const CardBase = classed.div("bg-primary border border-gray-100 rounded-[16px] overflow-hidden", {
  variants: {
    spacing: {
      small: "p-8",
      medium: "py-8 px-10 md:px-16",
    },
    shadow: {
      true: "shadow-card",
    },
  },
  defaultVariants: {
    shadow: true,
    spacing: "small",
  },
});

const CardImage = classed.div("min-h-[155px] bg-gray-300 bg-cover bg-center");
const CardContent = classed.div("p-4");

const Card = {
  displayName: "Card",
  Base: CardBase,
  Image: CardImage,
  Content: CardContent,
};

export { Card };
