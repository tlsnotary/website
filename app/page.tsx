import { AppLink } from "@/components/AppLink";
import { AppContainer } from "../components/AppContainer";
import { Banner, BannerTitle, BannerWrapper } from "../components/ui/Banner";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { LABELS } from "../content";
import { LINKS } from "./settings";
import { Icons } from "@/components/Icons";
import { Section } from "@/components/Section";
import Image from "next/image";
import { classed } from "@tw-classed/react";

interface ComparisonTableProps {
  title: string;
  tls: boolean;
  tlsNotary: boolean;
}

const TableWrapper = classed.div("grid grid-cols-4 ");
const TableTitle = classed.h4("font-semibold text-xs text-inter text-brown-50 uppercase md:text-[15px]");
const TableContent = classed.div("p-4");

const ComparisonTable = ({ title, tls, tlsNotary }: ComparisonTableProps) => {
  return (
    <TableWrapper>
      <TableContent className=" col-span-2">
        <span className="text-primary font-semibold text-sm text-inter md:text-lg">{title}</span>
      </TableContent>
      <TableContent className="m-auto">{tls ? <Icons.Check /> : <Icons.X />}</TableContent>
      <TableContent className="m-auto">{tlsNotary ? <Icons.Check /> : <Icons.X />}</TableContent>
    </TableWrapper>
  );
};

export default function Home() {
  return (
    <main>
      <AppContainer className="flex flex-col">
        <div className="flex flex-col gap-8 md:gap-12 pt-10 pb-0 lg:gap-16 lg:py-16 ">
          <div className="flex flex-col gap-4 md:gap-10">
            <div className="flex flex-col gap-2 w-full lg:w-3/4">
              <Label.Subtitle className=" ">{LABELS.HOMEPAGE.SUBTITLE}</Label.Subtitle>
              <Label.Title>{LABELS.HOMEPAGE.TITLE}</Label.Title>
            </div>
            <span className="w-full lg:w-3/4 text-primary text-sm leading-5 font-inter md:text-xl font-medium">
              {LABELS.HOMEPAGE.DESCRIPTION}
            </span>
          </div>

          <AppLink href={LINKS.DOCUMENTATION} external>
            <Button className="w-full md:w-auto">{LABELS.COMMON.CHECKOUT_DOCS}</Button>
          </AppLink>
        </div>
        <Icons.DividerHomepage className="hidden md:flex mx-auto w-full" />
      </AppContainer>

      <AppContainer className="py-8 md:py-[120px] w-full lg:!max-w-[960px]">
        <Section
          title={
            <h3 className="text-primary text-2xl font-bold md:text-center md:text-5xl md:leading-[49px]">
              {LABELS.HOMEPAGE.WHY_USE_TLSNOTARY.TITLE}
            </h3>
          }
          description={LABELS.HOMEPAGE.WHY_USE_TLSNOTARY.DESCRIPTION}
        >
          <div className="relative w-full h-[200px] py-16">
            <Image className="hidden md:block" src="/images/infographic.svg" alt="infographic" fill />
            <Image className="block md:hidden" src="/images/infographic-mobile.svg" alt="infographic mobile" fill />
          </div>
        </Section>
      </AppContainer>

      <AppContainer className="pb-16 md:pb-[120px]">
        <div className="!max-w-[640px] mx-auto">
          <TableWrapper className="hidden md:!grid px-8">
            <div className=" col-span-2"></div>
            <TableContent className="text-center">
              <span className="text-primary font-bold py-4 font-inter text-xs md:text-2xl">TLS</span>
            </TableContent>
            <TableContent className="text-center">
              <span className="text-primary font-bold py-4 font-inter text-xs md:text-2xl">TLSNotary</span>
            </TableContent>
          </TableWrapper>
          <div className="p-2 border border-gray-100 bg-gray rounded-xl md:p-8 ">
            <TableWrapper className="block md:hidden">
              <div className=" col-span-2"></div>
              <TableContent className="text-center">
                <span className="text-primary font-black py-4 font-inter text-[13px]">TLS</span>
              </TableContent>
              <TableContent className="text-center">
                <span className="text-primary font-black py-4 font-inter text-[13px]">TLSN</span>
              </TableContent>
            </TableWrapper>
            <TableContent>
              <TableTitle>{LABELS.COMMON.SERVER_AUTHENTICATION}</TableTitle>
            </TableContent>
            <ComparisonTable title="Data Origin" tls tlsNotary />
            <ComparisonTable title="Data Integrity" tls tlsNotary />

            <TableContent>
              <TableTitle>{LABELS.COMMON.DATA_PORTABILITY}</TableTitle>
            </TableContent>
            <ComparisonTable title="Trustless" tls={false} tlsNotary />
            <ComparisonTable title="Privacy Preserving" tls={false} tlsNotary />
          </div>
        </div>
      </AppContainer>

      <BannerWrapper color="gray">
        <AppContainer className="flex flex-col gap-4 md:gap-8">
          <BannerTitle className="text-center" variant="primary">
            {LABELS.COMMON.LEARN_THE_BASICS}
          </BannerTitle>

          <div className="mx-auto">
            <iframe
              className="w-full min-w-autos md:min-h-[320px] md:min-w-[560px]"
              src="https://www.youtube.com/embed/bNGSdlvIPfI?si=xJSG43Go-JQGy_hs"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              // @ts-ignore
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </AppContainer>
      </BannerWrapper>

      <Banner
        title={LABELS.HOMEPAGE.BUILD_WITH_US.TITLE}
        description={LABELS.HOMEPAGE.BUILD_WITH_US.DESCRIPTION}
        actions={
          <AppLink href={LINKS.DISCORD} external>
            <Button variant="primary">{LABELS.COMMON.JOIN_DISCORD}</Button>
          </AppLink>
        }
      />
    </main>
  );
}
