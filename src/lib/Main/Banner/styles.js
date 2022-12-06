import styled from "styled-components";

export const BannerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 800px;
  margin: auto;
  background-color: #f8f9fa;
  background-image: url(${(props) => props.image.src});
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: right top;
  @media (max-width: 990px) {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export const BannerContainerLeft = styled.div`
  width: 50%;
  margin: auto;
  @media (max-width: 990px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: -300px;
  }
`;

export const ContainerAll = styled.div`
  display: flex;
  width: 80%;
  margin: auto;
  @media (max-width: 990px) {
    width: 100%;
    height: 500px;
    flex-direction: column;
  }
`;

export const BannerContainerRight = styled.div`
  width: 50%;
  margin: auto;
  @media (max-width: 990px) {
    width: 400px;
    flex-direction: column;
    margin-top: -450px;
  }
`;

export const LeftBasement = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 850px;

  @media (max-width: 990px) {
    width: 100%;

    flex-direction: column;
  }
`;

export const LeftInsideTextUpper = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
`;

export const LeftInsideButton = styled.div`
  width: 60%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const TextTitle = styled.h1`
  font-size: 55px;
  margin-bottom: 8%;
`;

export const TextDescription = styled.h2`
  margin-bottom: 5%;
`;

export const RightBasement = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 800px;
`;
