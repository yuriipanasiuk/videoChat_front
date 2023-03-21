import styled from "styled-components";
import { SlScreenDesktop } from "react-icons/sl";

export const Wraper = styled.div`
  margin-top: 100px;
  display: flex;

  justify-content: center;
  border-top: 1px solid red;
`;

export const Icon = styled(SlScreenDesktop)`
  padding-top: 10px;
  cursor: pointer;

  :hover {
    scale: 1.1;
    color: red;
  }
`;
