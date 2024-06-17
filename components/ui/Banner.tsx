import { ReactNode } from "react";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type * as Classed from "@tw-classed/react";
import { classed } from "@tw-classed/react";
import { cn } from "../../shared/utils";
import ReactMarkdown from "react-markdown";
import { createMarkdownElement } from "../AppMarkdown";
import { AppContainer } from "../AppContainer";

export const BannerWrapper = classed.div("py-[120px] relative", {
  variants: {
    color: {
      brown: "bg-brown-50",
      gray: "bg-gray",
    },
  },
  defaultVariants: {
    color: "brown",
  },
});

export const BannerTitle = classed.h4("text-gold", {
  variants: {
    titleSize: {
      small: "text-[32px] font-semibold",
      medium: "text-3xl md:text-4xl lg:text-5xl md:leading-[49px] font-bold",
    },
    variant: {
      brown: "text-gold",
      primary: "text-primary",
    },
  },
  defaultVariants: {
    titleSize: "medium",
  },
});

type BannerProps = Classed.VariantProps<typeof BannerTitle> &
  Classed.VariantProps<typeof BannerWrapper> & {
    title: string;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
    descriptionClass?: string;
  };

export const Banner = ({ title, description, actions, descriptionClass, color }: BannerProps) => {
  return (
    <BannerWrapper color={color}>
      <AppContainer>
        <div className="mx-auto py-10 md:py-16 px-8 md:px-[120px] bg-white rounded-3xl w-full md:max-w-[900px]">
          <div className={cn("flex flex-col gap-8")}>
            <div className="flex flex-col gap-6">
              <span className=" text-primary font-sans font-bold text-2xl text-center md:text-5xl">{title}</span>
              {description && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  skipHtml={false}
                  components={{
                    strong: ({ node, ...props }) =>
                      createMarkdownElement("span", {
                        className: "font-medium",
                        ...props,
                      }),
                    a: ({ node, ...props }) =>
                      createMarkdownElement("a", {
                        className: "text-primary font-medium text-lg md:text-xl md:leading-6",
                        target: "_blank",
                        ...props,
                      }),
                    span: ({ ...props }: any) => (
                      <span className="text-primary font-normal text-lg md:text-xl md:leading-6" {...props} />
                    ),
                    p: ({ ...props }: any) => (
                      <span className="text-primary font-normal text-lg md:text-xl md:leading-6" {...props} />
                    ),
                  }}
                  className={cn(descriptionClass, "text-primary font-normal text-lg  md:text-xl md:leading-6")}
                >
                  {description}
                </ReactMarkdown>
              )}
            </div>
            <div className="mx-auto">{actions}</div>
          </div>
        </div>
      </AppContainer>
    </BannerWrapper>
  );
};
