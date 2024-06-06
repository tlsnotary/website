import { AppMarkdown } from "@/components/AppMarkdown";
import { AppContainer } from "../../components/AppContainer";
import { Section } from "../../components/Section";
import { Accordion } from "../../components/ui/Accordion";
import { LABELS } from "../../content";
import { FAQS } from "../../content/faq";
import React from "react";

export default function FAQPage() {
  return (
    <main>
      <AppContainer size="small" className="flex flex-col py-16 md:py-[120px]">
        <Section
          title={
            <h2 className="text-primary text-center font-bold font-inter text-[32px] md:text-[56px]">
              {LABELS.COMMON.FAQ}
            </h2>
          }
        >
          <div className="flex flex-col gap-6">
            {FAQS.map(({ answer, question }, index) => {
              return (
                <Accordion label={question} key={index}>
                  <AppMarkdown
                    customComponents={{
                      p: ({ ...props }) => (
                        <p
                          className="block overflow-hidden pt-4 text-primary text-sm leading-5 font-sans font-normal"
                          {...props}
                        />
                      ),
                      strong: ({ ...props }) => <span className="font-bold" {...props} />,
                      a: ({ ...props }) => (
                        <a className="font-semibold underline" target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                    }}
                  >
                    {answer}
                  </AppMarkdown>
                </Accordion>
              );
            })}
          </div>
        </Section>
      </AppContainer>
    </main>
  );
}
