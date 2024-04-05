"use client";

import Link from "next/link";
import { AppContainer } from "./AppContainer";
import { Icons } from "./Icons";
import { LINKS, NAVIGATION, SOCIALS_HEADER } from "@/app/settings";
import { classed } from "@tw-classed/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/shared/utils";
import { LABELS } from "@/content";

const NavLabel = classed.span("text-lg font-semibold hover:text-gold duration-300", {
  variants: {
    active: {
      false: "text-primary",
      true: "text-gold",
    },
  },
});

const AppMobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center md:hidden">
      <AppContainer className="flex w-full justify-between items-center py-4">
        <Link href="/" type="button" aria-label="logo">
          <Icons.Logo className="text-primary" size={48} />
        </Link>
        <button type="button" aria-label="burgher menu" onClick={() => setIsOpen(true)}>
          <Icons.Burgher className="text-primary dark:text-white" />
        </button>
      </AppContainer>
      {isOpen && (
        <div
          className="z-20 absolute inset-0 flex justify-end h-screen bg-black opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={cn(
          "fixed h-screen overflow-hidden duration-200 inset-y-0 right-0 z-30 flex flex-col bg-white dark:bg-gray-1000 text-white",
          {
            "w-full": isOpen,
            "w-0": !isOpen,
          }
        )}
      >
        <div className="flex justify-end p-6">
          <button type="button" onClick={() => setIsOpen(false)} aria-label="toggle menu">
            <Icons.Close className="text-primary dark:text-white" />
          </button>
        </div>
        <div className="flex w-full flex-col px-[16px] text-base font-medium">
          {NAVIGATION.map((item, index) => {
            return (
              <Link
                key={index}
                href={`${item.href}`}
                onClick={() => setIsOpen(false)}
                className="py-3 capitalize text-primary text-lg dark:text-white duration-200 font-semibold hover:text-gray-900"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex h-full w-full flex-col items-center justify-end gap-5 py-[40px] text-sm">
          <div className="flex gap-5">
            {SOCIALS_HEADER.map(({ href, external, icon }, index) => {
              return (
                <Link
                  className="text-primary hover:text-gold duration-300"
                  key={index}
                  href={href}
                  target={external ? "_blank" : undefined}
                >
                  {icon}
                </Link>
              );
            })}
          </div>
          <span className="text-center font-sans text-primary text-sm">{LABELS.COMMON.FOOTER.TITLE}</span>
        </div>
      </div>
    </div>
  );
};

const AppDesktopNav = () => {
  const pathname = usePathname();

  return (
    <AppContainer className="hidden md:py-[26px] md:grid items-center grid-cols-[200px_1fr_200px]">
      <Link href="/">
        <Icons.Logo className="text-primary" />
      </Link>
      <div className="mx-auto flex items-center gap-16">
        {NAVIGATION.map(({ label, href, external }, index) => {
          const pathParts = href.split("/").filter(Boolean);
          const isHome = pathname === "/" && href === "/";

          // is home or the first part of the path matches the first part of the href
          const isActive = isHome || (pathname !== null && pathParts[0] === pathname.split("/")[1]);

          return (
            <Link key={index} href={href} target={external ? "_blank" : undefined}>
              <NavLabel active={isActive}>{label}</NavLabel>
            </Link>
          );
        })}
      </div>
      <div className="ml-auto">
        <div className="flex gap-4">
          {SOCIALS_HEADER.map(({ href, external, icon }, index) => {
            return (
              <Link
                className="text-primary hover:text-gold duration-300"
                key={index}
                href={href}
                target={external ? "_blank" : undefined}
              >
                {icon}
              </Link>
            );
          })}
        </div>
      </div>
    </AppContainer>
  );
};

export const AppHeader = () => {
  return (
    <header className="sticky right-0 left-0 top-0 backdrop-blur-xl z-10">
      <AppDesktopNav />
      <AppMobileNav />
    </header>
  );
};
