import { AppLink } from "@/components/AppLink";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { LABELS } from "@/content";
import React from "react";
import { LINKS } from "../settings";
import { AppContainer } from "@/components/AppContainer";
import { Section } from "@/components/Section";
import { ProjectList, WebsiteType } from "@/content/projects";
import { Card } from "@/components/ui/Card";
import { Icons } from "@/components/Icons";

const IconMapping: Record<WebsiteType, React.ReactNode> = {
  twitter: <Icons.Twitter className="text-white hover:text-brown-50 duration-200" />,
  github: <Icons.Github className="text-white hover:text-brown-50 duration-200" />,
  website: <Icons.Website className="text-white hover:text-brown-50 duration-200" />,
};

export default function UseCases() {
  return (
    <div className="flex flex-col">
      <div className=" py-16">
        <AppContainer className="flex flex-col gap-16 !max-w-[800px]">
          <Section
            title={
              <h2 className=" text-primary font-semibold text-[32px] text-center">
                {LABELS.USE_CASES.USE_CASES.TITLE}
              </h2>
            }
            description={LABELS.USE_CASES.USE_CASES.DESCRIPTION}
          ></Section>

          <Section
            title={
              <h2 className=" text-primary font-semibold text-[32px] text-center">
                {LABELS.USE_CASES.BUILD_WITH_TLSNOTARY}
              </h2>
            }
          >
            <div className="grid grid-cols-1  gap-5 md:grid-cols-2">
              {ProjectList.map((project) => {
                return (
                  <Card.Base key={project.title}>
                    <div className="flex flex-col gap-3">
                      <h5 className=" text-white font-inter font-semibold text-[28px] leading-[28px]">
                        {project.title}
                      </h5>
                      <div className=" min-h-[100px]">
                        <span className="text-white text-sm font-normal font-inter line-clamp-5">{project.tldr}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                      {Object.keys(project?.links ?? []).map((website, index) => {
                        // @ts-ignore
                        const url: string | undefined = project.links?.[website] ?? undefined;

                        const icon: any = IconMapping[website as WebsiteType];

                        if (!url) return null;
                        if (!icon) return null;

                        return (
                          <AppLink key={index} href={url} external>
                            {icon}
                          </AppLink>
                        );
                      })}
                    </div>
                  </Card.Base>
                );
              })}
            </div>
          </Section>
        </AppContainer>
      </div>
      <Banner
        title={LABELS.USE_CASES.BANNER.TITLE}
        description={LABELS.USE_CASES.BANNER.DESCRIPTION}
        descriptionClass="text-center"
        actions={
          <AppLink href={LINKS.DISCORD} external>
            <Button variant="primary">{LABELS.COMMON.JOIN_DISCORD}</Button>
          </AppLink>
        }
      />
    </div>
  );
}
