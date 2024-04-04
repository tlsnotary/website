import { AppContainer } from "@/components/AppContainer";
import { Section } from "@/components/Section";
import { Accordion } from "@/components/ui/Accordion";
import { LABELS } from "@/content";
import { FAQS } from "@/content/faq";
import React from "react";

export default function FAQPage() {
  return (
    <main>
      <AppContainer size="small" className="flex flex-col pt-20 pb-16">
        <Section title={LABELS.COMMON.FAQ}>
          <div className="flex flex-col gap-6">
            {FAQS.map(({ answer, question }, index) => {
              return (
                <Accordion label={question} key={index}>
                  {answer}
                </Accordion>
              );
            })}
          </div>
        </Section>
      </AppContainer>
    </main>
  );
}
