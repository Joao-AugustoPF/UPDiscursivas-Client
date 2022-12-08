import React from "react";
import Img from "next/image";
import * as S from "../../../../lib/Main/Banner/styles";
import hero from "../../../../../public/img/hero-bg.png";

import Man from "../../../../../public/img/working-computer_7496-1423.png";
//Banner Page
export const Banner = () => {
  return (
    <>
      <S.BannerContainer image={hero}>
        <S.ContainerAll>
          <S.BannerContainerLeft>
            <S.LeftBasement>
              <S.LeftInsideTextUpper>
                <S.TextTitle>
                  A melhor plataforma para ajudar em suas provas
                </S.TextTitle>
                <S.TextDescription>
                  Lorem ipsum dolor sit amet, consectetur
                </S.TextDescription>
                <S.LeftInsideButton type="button" href="/assinaturas">
                  Ver planos
                </S.LeftInsideButton>
              </S.LeftInsideTextUpper>
            </S.LeftBasement>
          </S.BannerContainerLeft>
          <S.BannerContainerRight>
            <S.RightBasement>
              <Img src={Man} alt="Los Angeles" width="100%" height="100%" />;
            </S.RightBasement>
          </S.BannerContainerRight>
        </S.ContainerAll>
      </S.BannerContainer>
    </>
  );
};

export default Banner;
