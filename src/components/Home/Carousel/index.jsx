import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import { CarouselStyle } from "./CarouselStatistics.styles.js";
import {
  IntroductionSection,
  IntroductionDiv,
  WirdLogoInHome,
  IntroductionSectionDiv,
  WirdMinIntroduction,
  Introduction,
  BorderBottom,
} from "../../shared/styles";
import WirdLogo from "../../../assets/Logo/WirdLogosvg.svg";

import CarouselPry from "../../../assets/Carousel/CarouselPry.svg";
import { useTranslation } from "react-i18next";

export default function CarouselStatistics() {
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();
  const handleSelect = (selectedIndex, e) => {
    // setIndex(selectedIndex);
  };

  return (
    <CarouselStyle>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
          <img className="d-block w-100" src={CarouselPry} alt="First slide" />
          {/* <Carousel.Caption> */}
          <IntroductionSection>
            <Carousel.Caption>
              <IntroductionDiv>
                <WirdLogoInHome>
                  <img src={WirdLogo} alt="" width="200" />
                </WirdLogoInHome>

                <IntroductionSectionDiv>
                  <WirdMinIntroduction>{t("ourName")}</WirdMinIntroduction>
                  <Introduction>{t("welcomeMsg")}</Introduction>
                </IntroductionSectionDiv>
              </IntroductionDiv>
              <BorderBottom></BorderBottom>
              <h3>{t("ourName")}</h3>
              <p>{t("welcomeMsg")} </p>
            </Carousel.Caption>
          </IntroductionSection>

          {/* </Carousel.Caption> */}
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100" src={CarouselPry} alt="First slide" />
          {/* <Carousel.Caption> */}
          <IntroductionSection>
            <Carousel.Caption>
              <IntroductionDiv>
                <WirdLogoInHome>
                  <img src={WirdLogo} alt="" width="200" />
                </WirdLogoInHome>

                <IntroductionSectionDiv>
                  <WirdMinIntroduction>{t("ourName")}</WirdMinIntroduction>
                  <Introduction>{t("welcomeMsg")}</Introduction>
                </IntroductionSectionDiv>
              </IntroductionDiv>
              <BorderBottom></BorderBottom>
            </Carousel.Caption>
          </IntroductionSection>
          <h3>{t("ourName")}</h3>
          <p>{t("welcomeMsg")}</p>
          {/* </Carousel.Caption> */}
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100" src={CarouselPry} alt="First slide" />
          {/* <Carousel.Caption> */}
          <IntroductionSection>
            <Carousel.Caption>
              <IntroductionDiv>
                <WirdLogoInHome>
                  <img src={WirdLogo} alt="" width="200" />
                </WirdLogoInHome>

                <IntroductionSectionDiv>
                  <WirdMinIntroduction>{t("ourName")}</WirdMinIntroduction>
                  <Introduction>{t("welcomeMsg")}</Introduction>
                </IntroductionSectionDiv>
              </IntroductionDiv>
              <BorderBottom></BorderBottom>
            </Carousel.Caption>
          </IntroductionSection>
          <h3>{t("ourName")}</h3>
          <p>{t("welcomeMsg")}</p>
          {/* </Carousel.Caption> */}
        </Carousel.Item>
      </Carousel>
    </CarouselStyle>
  );
}
