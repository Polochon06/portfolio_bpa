import { gsap, Linear } from "gsap";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { isSmallScreen, NO_MOTION_PREFERENCE_QUERY } from "pages";
import { EMAIL, SOCIAL_LINKS } from "../../constants";
import Button, { ButtonTypes } from "../common/button";

const CONTACT_STYLE = {
  SLIDING_TEXT: "opacity-20 text-5xl md:text-7xl font-bold whitespace-nowrap",
  SECTION:
    "w-full relative select-none tall:py-36 py-48 section-container flex flex-col",
  TITLE: "mt-6 md:mt-8 font-medium text-4xl md:text-5xl text-center",
};

const CollaborationSection = () => {
  const quoteRef: MutableRefObject<HTMLDivElement> = useRef(null);
  const targetSection: MutableRefObject<HTMLDivElement> = useRef(null);
  const [willChange, setwillChange] = useState(false);

  const initTextGradientAnimation = (
    targetSection: MutableRefObject<HTMLDivElement>
  ): ScrollTrigger => {
    const timeline = gsap.timeline({ defaults: { ease: Linear.easeNone } });
    timeline
      .from(quoteRef.current, { opacity: 0, duration: 2 })
      .to(quoteRef.current.querySelector(".text-strong"), {
        backgroundPositionX: "100%",
        duration: 1,
      });

    return ScrollTrigger.create({
      trigger: targetSection.current,
      start: "center bottom",
      end: "center center",
      scrub: 0,
      animation: timeline,
      onToggle: (self) => setwillChange(self.isActive),
    });
  };

  const initSlidingTextAnimation = (
    targetSection: MutableRefObject<HTMLDivElement>
  ) => {
    const slidingTl = gsap.timeline({ defaults: { ease: Linear.easeNone } });
    slidingTl
      .to(targetSection.current.querySelector(".ui-left"), {
        xPercent: isSmallScreen() ? -500 : -150,
      })
      .from(
        targetSection.current.querySelector(".ui-right"),
        { xPercent: isSmallScreen() ? -500 : -150 },
        "<"
      );

    return ScrollTrigger.create({
      trigger: targetSection.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 0,
      animation: slidingTl,
    });
  };

  useEffect(() => {
    const textBgAnimation = initTextGradientAnimation(targetSection);
    let slidingAnimation: ScrollTrigger | undefined;
    const { matches } = window.matchMedia(NO_MOTION_PREFERENCE_QUERY);
    if (matches) {
      slidingAnimation = initSlidingTextAnimation(targetSection);
    }
    return () => {
      textBgAnimation.kill();
      slidingAnimation?.kill();
    };
  }, [quoteRef, targetSection]);

  const renderSlidingText = (text: string, layoutClasses: string) => (
    <p className={`${layoutClasses} ${CONTACT_STYLE.SLIDING_TEXT}`}>
      {Array(5)
        .fill(text)
        .reduce((str, el) => str.concat(el), "")}
    </p>
  );

  const renderTitle = () => (
    <div
      ref={quoteRef}
      className={`flex flex-col items-center ${
        willChange ? "will-change-opacity" : ""
      }`}
    >
      <h1 className={CONTACT_STYLE.TITLE}>
        On travaille{" "}
        <span className="text-strong font-bold">ensemble</span>&nbsp;?
      </h1>
      <p className="text-gray-400 text-lg mt-3 text-center">
        Disponible pour stage / alternance &mdash; contactez-moi directement.
      </p>
      <div className="flex gap-4 mt-8 flex-wrap justify-center">
        <Button
          type={ButtonTypes.PRIMARY}
          name="Envoyer un mail"
          href={`mailto:${EMAIL}`}
          otherProps={{}}
          classes=""
        />
        <Button
          type={ButtonTypes.OUTLINE}
          name="GitHub"
          href={SOCIAL_LINKS.github}
          otherProps={{ target: "_blank", rel: "noreferrer" }}
          classes=""
        />
        <Button
          type={ButtonTypes.OUTLINE}
          name="LinkedIn"
          href={SOCIAL_LINKS.linkedin}
          otherProps={{ target: "_blank", rel: "noreferrer" }}
          classes=""
        />
      </div>
    </div>
  );

  return (
    <section className={CONTACT_STYLE.SECTION} ref={targetSection}>
      {renderSlidingText(
        " Développement Web  Motion Design  BTS SIO SLAM ",
        "ui-left"
      )}
      {renderTitle()}
      {renderSlidingText(
        " Backend Java/Spring  Frontend React  After Effects ",
        "mt-6 md:mt-8 ui-right"
      )}
    </section>
  );
};

export default CollaborationSection;
