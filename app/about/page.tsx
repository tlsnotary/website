import { AppContainer } from "../../components/AppContainer";
import { Section } from "../../components/Section";
import { Button } from "../../components/ui/Button";
import React from "react";
import { LINKS } from "../settings";
import { Banner } from "../../components/ui/Banner";
import { LABELS } from "../../content";
import { AppLink } from "@/components/AppLink";

export default function AboutPage() {
  return (
    <main>
      <AppContainer className="flex flex-col gap-12 md:gap-20 pt-20 pb-16" size="small">
        <Section
          title={
            <h2 className="text-primary font-semibold font-inter text-center text-[32px]">
              {LABELS.ABOUT.WHO_WE_ARE.TITLE}
            </h2>
          }
          description={LABELS.ABOUT.WHO_WE_ARE.DESCRIPTION}
        >
          <div className="mx-auto">
            <AppLink href="" external showExternalIcon>
              <Button variant="transparent">{LABELS.COMMON.VIEW_DOCUMENTATION}</Button>
            </AppLink>
          </div>
        </Section>

        <Section
          title={
            <h2 className="text-primary font-semibold font-inter text-center text-[32px]">
              {LABELS.ABOUT.GET_INVOLVED.TITLE}
            </h2>
          }
          description={LABELS.ABOUT.GET_INVOLVED.DESCRIPTION}
        >
          <div className="mx-auto">
            <AppLink href={LINKS.GITHUB} external showExternalIcon>
              <Button variant="transparent">{LABELS.COMMON.CHECKOUT_GITHUB}</Button>
            </AppLink>
          </div>
        </Section>
      </AppContainer>
      <Banner
        title={LABELS.COMMON.CONNECT_WITH_US.TITLE}
        description={LABELS.COMMON.CONNECT_WITH_US.DESCRIPTION}
        actions={
          <AppLink href={LINKS.DISCORD} external>
            <Button variant="primary">{LABELS.COMMON.JOIN_DISCORD}</Button>
          </AppLink>
        }
      />
    </main>
  );
}
