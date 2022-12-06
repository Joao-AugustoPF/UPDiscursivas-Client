import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  background-color: #f8f9fa;
  background-image: url(${(props) => props.image.src});
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: right top;
`;

export const InsideContainer = styled.div`
  padding: 6%;
  text-align: center;
  width: 70%;
  margin: auto;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  margin: auto;

  @media (max-width: 960px) {
    grid-template-columns: auto;
  }
`;

export const GridItem = styled.div`
  display: inline-grid;
  margin: auto;
`;

export const BoxProdutorImage = styled.div`
  width: 300px;
  height: 300px;
  background: gray;
  margin: auto;

  @media (max-width: 960px) {
    width: 200px;
  }
`;

export const ProdutorInfo = styled.div`
  position: absolute;
  background-color: #fff;
  width: 230px;
  font-weight: bold;
  padding: 20px 0;
  max-height: 95px;
  overflow: hidden;
  box-shadow: 0px 2px 15px rgb(0 0 0 / 10%);
  transition: max-height 0.5s ease-in-out;
  margin-top: 250px;

  @media (max-width: 960px) {
    width: 200px;
  }
`;

export const ContainerGrid = styled.div`
  display: flex;
  padding: 50px;
  justify-content: center;
`;
