import { HTMLAttributes } from "react";
import { Label } from "./ui/Label";
import { AppMarkdown } from "./AppMarkdown";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export const Section = ({ title, description, children }: SectionProps) => {
  return (
    <div className="flex flex-col gap-6 md:gap-16">
      <div className="flex flex-col gap-4 md:gap-8">
        <Label.SectionTitle className="text-center">{title}</Label.SectionTitle>
        {description && <AppMarkdown>{description}</AppMarkdown>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};
