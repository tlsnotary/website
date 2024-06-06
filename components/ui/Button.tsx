import { classed } from "@tw-classed/react";
import type * as Classed from "@tw-classed/react";
import React, { forwardRef, HTMLAttributes } from "react";

const ButtonComponent = classed.button(
  "relative overflow-hidden font-medium cursor-pointer justify-center flex items-center gap-2 border rounded-[32px] inline-block disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        transparent: "border-transparent bg-transparent text-brown-50 hover:text-brown-70 !p-2",
        primary: "bg-primary border-primary text-white hover:bg-brown-70 hover:border-brown-70 hover:text-white",
      },
      size: {
        medium: "text-sm md:text-base lg:text-xl md:leading-6 py-2 md:py-[14px] px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

type ButtonVariants = Classed.VariantProps<typeof ButtonComponent>;

interface ButtonProps extends ButtonVariants, HTMLAttributes<HTMLButtonElement> {
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
