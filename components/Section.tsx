import { HTMLAttributes, ReactNode } from "react";
import { Label } from "./ui/Label";
import { AppMarkdown } from "./AppMarkdown";

interface SectionProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: string;
}

export const Section = ({ title, description, children }: SectionProps) => {
  return (
    <div className="flex flex-col gap-6 md:gap-16">
      <div className="flex flex-col gap-4 md:gap-8">
        {typeof title === "string" ? <Label.SectionTitle className="text-center">{title}</Label.SectionTitle> : title}
        {description && <AppMarkdown>{description}</AppMarkdown>}
        {children && <div className="flex">{children}</div>}
      </div>
    </div>
  );
};
