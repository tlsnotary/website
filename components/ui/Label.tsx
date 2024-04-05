import { classed } from "@tw-classed/react";

const Title = classed.h1(
  "text-5xl font-black leading-1 text-primary md:text-6xl lg:text-8xl lg:leading-[108px]"
);

const Subtitle = classed.h6(
  "text-brown-50 font-bold text-lg leading-none md:text-2xl md:leading-6"
);

const SectionTitle = classed.h6(
  "font-semibold text-primary text-2xl leading-[24px] md:text-[32px] leading-[32px]"
);

const Paragraph = classed.span("text-primary text-sm md:text-xl leading-6");

const Label = {
  displayName: "Label",
  Title,
  Subtitle,
  SectionTitle,
  Paragraph,
};

export { Label };
