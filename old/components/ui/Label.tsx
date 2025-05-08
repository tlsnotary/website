import { classed } from "@tw-classed/react";

const Title = classed.h1(
  "text-2xl font-extrabold leading-1 text-primary md:text-6xl  md:font-black lg:text-[96px] lg:leading-[101px]"
);

const Subtitle = classed.h6(
  "text-brown-50 font-extrabold text-sm leading-none md:font-black md:text-2xl lg:text-7xl md:leading-6"
);

const SectionTitle = classed.h6(
  "font-semibold font-inter text-primary text-2xl leading-[24px] md:text-[56px] md:leading-[56px]"
);

const Paragraph = classed.span(
  "text-primary leading-5 font-medium fon-inter text-sm md:font-normal md:text-xl md:leading-6"
);

const Label = {
  displayName: "Label",
  Title,
  Subtitle,
  SectionTitle,
  Paragraph,
};

export { Label };
