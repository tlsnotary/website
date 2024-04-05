import { classed } from "@tw-classed/react";
import type * as Classed from "@tw-classed/react";
import React, { forwardRef, HTMLAttributes } from "react";

const ButtonComponent = classed.button(
  "relative overflow-hidden font-semibold cursor-pointer justify-center flex items-center gap-2 border rounded-[32px] inline-block disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        transparent:
          "border-transparent bg-transparent text-primary hover:opacity-60",
        primary:
          "bg-white border-primary text-primary hover:bg-primary hover:text-white",
      },
      size: {
        medium:
          "text-sm md:text-base lg:text-xl md:leading-6 py-2 md:py-3 lg:py-[18px] px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

type ButtonVariants = Classed.VariantProps<typeof ButtonComponent>;

interface ButtonProps
  extends ButtonVariants,
    HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, variant, size, icon } = props;

  return (
    <ButtonComponent ref={ref} variant={variant} size={size} {...props}>
      {icon}
      <span className="z-[2]">{children}</span>
    </ButtonComponent>
  );
});

Button.displayName = "Button";

export { Button };
