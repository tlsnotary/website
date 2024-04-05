import { AppContainer } from "../../components/AppContainer";
import { Section } from "../../components/Section";
import { Button } from "../../components/ui/Button";
import Link from "next/link";
import React from "react";
import { LINKS } from "../settings";
import { Card } from "../../components/ui/Card";
import { COMMON_CONTENT } from "../../content/common";
import { Banner } from "../../components/ui/Banner";
import { LABELS } from "../../content";

export default function AboutPage() {
  return (
    <main>
      <AppContainer className="flex flex-col gap-12 md:gap-20 pt-20 pb-16" size="small">
        <Section title={LABELS.ABOUT.WHO_WE_ARE.TITLE} description={LABELS.ABOUT.WHO_WE_ARE.DESCRIPTION} />

        <Section title={LABELS.ABOUT.HOW_IT_WORKS.TITLE} description={LABELS.ABOUT.HOW_IT_WORKS.DESCRIPTION}>
          <div className="grid grid-cols gap-8">
            {LABELS.ABOUT.HOW_IT_WORKS.STEPS.map((step, index) => (
              <Card.Base className="appear" spacing="medium" shadow={false} key={index}>
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                  <div className="w-[120px] mx-auto md:mx-0">{step?.icon}</div>
                  <div className="flex flex-col gap-4">
                    <span className="text-lg text-primary font-semibold leading-[21px]">{step.TITLE}</span>
                    <span className="text-lg text-primary leading-[21px]">{step.DESCRIPTION}</span>
                  </div>
                </div>
              </Card.Base>
            ))}
          </div>
        </Section>

        <Section title={LABELS.ABOUT.GET_INVOLVED.TITLE} description={LABELS.ABOUT.GET_INVOLVED.DESCRIPTION} />

        <div className="flex flex-col w-full md:w-auto md:flex-row gap-4 mx-auto">
          <Link href={LINKS.DOCUMENTATION} target="_blank">
            <Button className="w-full">{COMMON_CONTENT.VIEW_DOCUMENTATION}</Button>
          </Link>
          <Link href={LINKS.GITHUB}>
            <Button className="w-full" variant="transparent">
              {COMMON_CONTENT.FORK_REPO}
            </Button>
          </Link>
        </div>
      </AppContainer>
      <Banner title={LABELS.COMMON.CONNECT_WITH_US.TITLE} description={LABELS.COMMON.CONNECT_WITH_US.DESCRIPTION} />
    </main>
  );
}
