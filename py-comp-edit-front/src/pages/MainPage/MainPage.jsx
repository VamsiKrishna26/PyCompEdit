import React from "react";
import styled from "styled-components";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectUser } from "../../redux/user/user.selecter";
import MainPageGuest from "./MainPageGuest";
import { ReactComponent as Monitor } from "./Monitor.svg";
import { ReactComponent as Discussions } from "./Discussions.svg";
import { ReactComponent as Code } from "./Code.svg";
import MainPageUser from "./MainPageUser";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import DiscScreen from "./DiscScreen.png";
import EditorScreen from "./EditorScreen.jpeg";

const MainPageDiv = styled.div`
  color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.black)};
  font-family: "Singlet", cursive;
  font-size: 20px;
  padding-top: 1em;

  .first-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 1em;

    .monitor {
      flex: 1;
      height: 200px;
      margin-right: 0.5em;
      width: 200px;
      color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.theme)};
    }

    .title {
      flex: 1;
      font-size: 28px;
      color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.theme)};
    }
  }

  .second-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1em;
  }

  .icon {
    height: 50px;
    width: 50px;
  }

  .item-back {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
    margin: 1em 0em 0em 0em;
    min-height: 200px;

    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .image {
      flex: 1;
      img {
        width: 100%;
      }
      margin-left: 0.5em;
      margin-right: 0.5em;
    }
  }

  .third-item-back {
    background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.theme)};
    color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.white)};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
    margin: 1em 0em 0em 0em;
    min-height: 200px;

    .third-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .image {
      flex: 1;
      img {
        width: 100%;
      }
      margin-left: 0.5em;
      margin-right: 0.5em;
    }
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

const MainPage = (props) => {
  const { user } = props;

  const { $darkThemeHome, colors, fontFamily, font_sizes } = props;

  const navigate = useNavigate();

  return (
    <MainPageDiv {...props}>
      <div className="first-item">
        <Monitor className="monitor" />
        <div className="title">Hey Coder! Let's code in a new way!!</div>
      </div>
      <div className="second-item">
        <div className="para">This platform lets you edit and save codes and have discussions among peers.</div>
      </div>
      {user ? <MainPageUser {...props} /> : <MainPageGuest {...props} />}
      <div className={`${!user ? `item-back` : `third-item-back`}`}>
        <div className="image">
          <img src={DiscScreen} />
        </div>
        <div className={`${!user ? `item` : `third-item`}`}>
          <Discussions className="icon" />
          <div className="para">Have discussions among peers in a forum.</div>
          <div className="button-login">
            <StyledButton
              $darkTheme={$darkThemeHome}
              colors={colors}
              fontFamily={fontFamily}
              onClick={() => {
                navigate(`/discussions`);
              }}
            >
              Discussions
            </StyledButton>
          </div>
        </div>
      </div>
      <div className={`${user ? `item-back` : `third-item-back`}`}>
        <div className={`${user ? `item` : `third-item`}`}>
          <Code className="icon" />
          <div className="para">
            Write some programs using a sophisticated text editor with rich features like Autosaving, intelligent coding and syntax highlighting.
          </div>
          <div className="button-login">
            <StyledButton
              $darkTheme={$darkThemeHome}
              colors={colors}
              fontFamily={fontFamily}
              onClick={() => {
                navigate(`/editor`);
              }}
            >
              Code Editor
            </StyledButton>
          </div>
        </div>
        <div className="image">
          <img src={EditorScreen} />
        </div>
      </div>
    </MainPageDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(MainPage);
