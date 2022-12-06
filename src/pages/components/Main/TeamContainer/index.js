import React from "react";
import * as S from "../../../../lib/Main/Banner/TeamContainer/styles";
import Image from "next/image";
import person from "../../../../../public/img/v3_0105443.jpg";
import hero from "../../../../../public/img/hero-bg.png";

//Team Container of main page
export const TeamContainer = () => {
  return (
    <>
      <S.Container image={hero}>
        <S.InsideContainer>
          <h2>Produtores</h2>
          <h4>
            Qui nostrud reprehenderit velit proident amet adipisicing laborum
            consectetur aliquip aliquip. Irure labore Lorem duis excepteur ad
            dolor. Aliqua incididunt tempor laboris qui qui elit sunt. Est do ut
            et non anim fugiat sunt qui ullamco officia ad ea eiusmod laboris.
          </h4>

          <S.GridContainer>
            <S.GridItem>
              <S.ContainerGrid>
                <S.BoxProdutorImage>
                  <Image src={person} />
                </S.BoxProdutorImage>
                <S.ProdutorInfo>
                  <p>Antônio E. Fagundes</p>
                </S.ProdutorInfo>
              </S.ContainerGrid>
            </S.GridItem>
            <S.GridItem>
              <S.ContainerGrid>
                <S.BoxProdutorImage>
                  <Image src={person} />
                </S.BoxProdutorImage>
                <S.ProdutorInfo>
                  <p>João Augusto</p>
                </S.ProdutorInfo>
              </S.ContainerGrid>
            </S.GridItem>
          </S.GridContainer>
        </S.InsideContainer>
      </S.Container>
    </>
  );
};

export default TeamContainer;
