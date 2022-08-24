import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Navbar from "../Nav/Navbar";

const MainPageGuestDiv = styled.div`
  .ask-login {
    margin: 1em 0em 0em 0em;
    padding: 1em;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.theme)};
    color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.white)};
  }
`;

const StyledButton = styled(Button)`
  color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.black)};
  background-color: ${(props) => (props.$darkTheme ? props.colors.dark : props.colors.white)};
  margin: 1em;
  border: ${(props) => (props.$darkTheme ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  :hover {
    color: ${(props) => (props.$darkTheme ? props.colors.black : props.colors.white)};
    background-color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.theme)};
    border: ${(props) => (props.$darkTheme ? `1px solid ${props.colors.theme}` : `1px solid ${props.colors.black}`)};
  }
`;

const MainPageGuest = (props) => {
  const [showLogin, setShowLogin] = useState(false);

  const { $darkThemeHome, colors, fontFamily,font_sizes } = props;

  return (
    <MainPageGuestDiv {...props}>
      <div className="ask-login">
        <div className="para-login">Explore more features by simply creating an account or by login.</div>
        <div className="button-login">
          <StyledButton $darkTheme={$darkThemeHome} colors={colors} fontFamily={fontFamily} onClick={()=>{setShowLogin(!showLogin)}}>
            Login or Register now
          </StyledButton>
        </div>
      </div>
      {showLogin ? (
        <Navbar
          hideNavbar={true}
          showMessage={true}
          showModal={true}
          $darkTheme={$darkThemeHome}
          colors={colors}
          font={fontFamily}
          font_sizes={font_sizes}
          {...props}
        />
      ) : null}
    </MainPageGuestDiv>
  );
};

export default MainPageGuest;
