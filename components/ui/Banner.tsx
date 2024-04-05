import Image from "next/image";
import { ReactNode } from "react";
import { AppContainer } from "../AppContainer";
import type * as Classed from "@tw-classed/react";
import { classed } from "@tw-classed/react";
import { cn } from "@/shared/utils";

const BannerTitle = classed.h4("text-gold", {
  variants: {
    titleSize: {
      small: "text-[32px] font-semibold",
      medium: "text-3xl md:text-4xl lg:text-5xl md:leading-[49px] font-bold",
    },
  },
  defaultVariants: {
    titleSize: "medium",
  },
});

type BannerProps = Classed.VariantProps<typeof BannerTitle> & {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  inverse?: boolean; // used to determine the banner image and content
};

const BannerImage = ({ inverse }: Pick<BannerProps, "inverse">) => {
  if (inverse) {
    return (
      <Image
        src="/images/banner-inverse.svg"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
        alt="banner inverse"
      />
    );
  }

  return (
    <>
      <Image
        src="/images/banner.svg"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
        alt="banner desktop"
        className="hidden md:block"
      />
    </>
  );
};

export const Banner = ({
  title,
  description,
  inverse = false,
  children,
  actions,
  titleSize,
}: BannerProps) => {
  return (
    <div className="bg-primary py-10 md:py-0 md:bg-transparent relative md:h-[600px]">
      <BannerImage inverse={inverse} />

      <AppContainer className="relative gap-8 md:gap-0 grid md:grid-cols-2 h-full items-center">
        <div
          className={cn("flex flex-col gap-8", {
            "md:col-start-2": !inverse,
          })}
        >
          <div className="flex flex-col gap-6">
            <BannerTitle titleSize={titleSize}>{title}</BannerTitle>
            {description && (
              <span className="text-white font-medium text-lg md:text-xl md:leading-6">
                {description}
              </span>
            )}
          </div>
          {actions}
        </div>
        {children && (
          <div
            className={cn({
              "md:col-start-2": inverse,
            })}
          >
            {children}
          </div>
        )}
      </AppContainer>
    </div>
  );
};
