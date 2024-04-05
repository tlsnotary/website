import { AppContainer } from "../components/AppContainer";
import { Banner } from "../components/ui/Banner";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { LABELS } from "../content";
import { COMMON_CONTENT } from "../content/common";
import { WHAT_WE_DO } from "../content/whatWeDo";

export default function Home() {
  return (
    <main>
      <AppContainer className="flex flex-col gap-8 md:gap-12 lg:gap-16 pt-16 pb-6">
        <div className="flex flex-col gap-2 lg:w-3/4">
          <Label.Subtitle>{LABELS.HOMEPAGE.SUBTITLE}</Label.Subtitle>
          <Label.Title>{LABELS.HOMEPAGE.TITLE}</Label.Title>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button>{LABELS.COMMON.VIEW_DOCUMENTATION}</Button>
          <Button variant="transparent">{LABELS.COMMON.FORK_REPO}</Button>
        </div>
      </AppContainer>

      <Banner title={LABELS.HOMEPAGE.INTRO.TITLE} description={LABELS.HOMEPAGE.INTRO.DESCRIPTION} />

      <AppContainer className="py-[120px] ">
        <div className="flex flex-col gap-10 md:gap-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {WHAT_WE_DO.map(({ title, icon }, index) => {
              return (
                <Card.Base className="appear" shadow key={index}>
                  <div className="flex flex-col gap-14 items-center">
                    {icon}
                    <span className=" text-primary text-xl font-semibold leading-6">{title}</span>
                  </div>
                </Card.Base>
              );
            })}
          </div>
          <span className="appear text-center text-primary text-xl font-semibold leading-6">
            {COMMON_CONTENT.AND_MORE}
          </span>
        </div>
      </AppContainer>

      <Banner
        title={LABELS.HOMEPAGE.DOWNLOAD.TITLE}
        description={LABELS.HOMEPAGE.DOWNLOAD.DESCRIPTION}
        titleSize="small"
        inverse
      >
        <div className="flex justify-center items-center bg-slate-200 rounded-2xl h-[260px] md:h-[400px]">
          <span className="font-sans text-primary">PLACEHOLDER</span>
        </div>
      </Banner>
    </main>
  );
}
