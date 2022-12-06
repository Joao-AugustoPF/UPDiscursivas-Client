import styled from "styled-components";

export const MenuToggle = styled.div`
  display: none;
  @media (max-width: 991px) {
    display: flex;
    margin-top: 20px;
  }
`;

export const MenuImageToggle = styled.div`
  width: 60px;
  height: 60px;
  @media (max-width: 991px) {
  }
`;

export const ToggleAuthOff = styled.div`
  display: none;
  @media (max-width: 991px) {
    display: flex;
    margin-top: 20px;
  }
`;

export const ContainerOusite = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #f8f9fa;
`;

export const AuthToggle = styled.div`
  display: flex;
  margin-top: 20px;
  @media (max-width: 991px) {
    display: none;
  }
`;
