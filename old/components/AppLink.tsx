import Link from "next/link";
import React from "react";
import { Icons } from "./Icons";
import { cn } from "@/shared/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  showExternalIcon?: boolean;
}

/**
 * This component easily manages internal and external links and adds the necessary attributes.
 *
 * @param {string} href - The URL of the link.
 * @param {React.ReactNode} children - The content of the link.
 * @param {boolean} external - If the link is external, in this case it will open in a new tab and also add rel="noreferrer noopener nofollow".
 */
export const AppLink = ({ href, children, external, className, showExternalIcon = false, ...props }: LinkProps) => {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener nofollow" : undefined}
      className={cn(className, "flex items-center group")}
      {...props}
    >
      {children}
      {showExternalIcon && external && (
        <Icons.ExternalLink className="text-brown-50 group-hover:text-brown-70 duration-300" />
      )}
    </Link>
  );
};
