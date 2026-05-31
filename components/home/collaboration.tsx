import { gsap, Linear } from "gsap";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { isSmallScreen, NO_MOTION_PREFERENCE_QUERY } from "pages";
import { EMAIL } from "../../constants";

const COLLABORATION_STYLE = {
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
    <p className={`${layoutClasses} ${COLLABORATION_STYLE.SLIDING_TEXT}`}>
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
      <h1 className={COLLABORATION_STYLE.TITLE}>
        Intéressé par une{" "}
        <span className="text-strong font-bold">collaboration</span>&nbsp;?
      </h1>

      {/* Chat bubble */}
      <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
        <div className="flex items-end gap-2">
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            P
          </div>
          <div
            className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-white max-w-xs"
            style={{ background: "#1f2937" }}
          >
            Bonjour&nbsp;! Je suis disponible pour un stage ou une alternance.
          </div>
        </div>
        <div className="flex items-end gap-2 flex-row-reverse">
          <div
            className="rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white max-w-xs"
            style={{ background: "#6366f1" }}
          >
            Vous pouvez me contacter directement 👇
          </div>
        </div>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-2 self-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }}
        >
          ✉ Envoyer un message à Paul
        </a>
      </div>
    </div>
  );

  return (
    <section className={COLLABORATION_STYLE.SECTION} ref={targetSection}>
      {renderSlidingText(
        " Développement Web  Motion Design ",
        "ui-left"
      )}
      {renderTitle()}
      {renderSlidingText(
        " Backend Java/Spring  Frontend React/WebGL ",
        "mt-6 md:mt-8 ui-right"
      )}
    </section>
  );
};

export default CollaborationSection;
