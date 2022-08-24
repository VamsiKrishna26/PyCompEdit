import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Editor from "./pages/Editor/Editor";
import "./App.scss";
import Navbar from "./pages/Nav/Navbar";
import { createStructuredSelector } from "reselect";
import { selectUser } from "./redux/user/user.selecter";
import { connect } from "react-redux";
import { Route, Routes } from "react-router";
import Submissions from "./pages/Submissions/Submissions";
import Discussions from "./pages/Discussions/Discussions";
import Discussion from "./pages/Discussion/Discussion";
import AddDiscussion from "./pages/Discussions/AddDiscussion";
import RoughWork from "./pages/RoughWork";
import MainPage from "./pages/MainPage/MainPage";

const AppDiv = styled.div`
  .body {
    background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark_bg : props.colors.white)};
    /* padding: 1em; */
    min-height: 95vh;
  }

  *::-webkit-scrollbar {
    width: 10px;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  *::-webkit-scrollbar-track {
    background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.white)};
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    border-radius: 15px 15px 15px 15px;
    border: 0px !important;
  }
  *::-webkit-scrollbar-thumb {
    background-color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.theme)};
    border-radius: 15px 15px 15px 15px;
    margin-top: 0.5em;
    margin-bottom: 0.5em;

    /* :hover {
      opacity: 0.8;
      background: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.theme)};
    } */
  }

  .footer{
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1em;
    background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.theme)};
    color: white;
    word-wrap: break-word;
  }
  @media only screen and (max-width: 768px) {
  }
`;

const App = (props) => {
  const { user } = props;

  let [darkThemeHome, setDarkThemeHome] = useState(
    JSON.parse(localStorage.getItem("dark_theme_home")) ||
      (JSON.parse(localStorage.getItem("dark_theme_home")) === undefined && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  let [themeColor, setThemeColor] = useState(JSON.parse(localStorage.getItem("themeColor")) || "#4b0082");

  useEffect(() => {
    localStorage.setItem("themeColor", JSON.stringify(themeColor));
  }, [themeColor]);

  let colors = {
    dark: "rgb(66,66,66)",
    white: "white",
    theme: themeColor,
    black: "black",
    dark_bg: "rgb(128, 128, 128)",
  };

  let font_sizes = {
    heading1: "28px",
    heading2: "24px",
    heading3: "20px",
    heading4: "18px",
    text: "16px",
  };

  let font = "'Kantumruy Pro', sans-serif";

  return (
    <AppDiv $darkThemeHome={darkThemeHome} colors={colors}>
      <Navbar
        hideNavbar={false}
        showMessage={false}
        showModal={false}
        $darkThemeHome={darkThemeHome}
        setDarkThemeHome={setDarkThemeHome}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        colors={colors}
        font={font}
        font_sizes={font_sizes}
        {...props}
      />
      <div className="body">
        <Routes>
          <Route path="/editor" element={<Editor $darkThemeHome={darkThemeHome} colors={colors} {...props} />} />
          {
            <Route
              path="/submissions"
              element={
                user ? (
                  <Submissions $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props} />
                ) : (
                  <Navbar
                    hideNavbar={true}
                    showMessage={true}
                    showModal={true}
                    $darkThemeHome={darkThemeHome}
                    colors={colors}
                    font={font}
                    font_sizes={font_sizes}
                    {...props}
                  />
                )
              }
            />
          }
          <Route
            path="/discussions/:discussionId"
            element={<Discussion $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props} />}
          />
          <Route path="/discussions" element={<Discussions $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props} />} />
          {
            <Route
              path="/discussions/addDiscussion"
              element={
                user ? (
                  <AddDiscussion $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props} />
                ) : (
                  <Navbar
                    hideNavbar={true}
                    showMessage={true}
                    showModal={true}
                    $darkThemeHome={darkThemeHome}
                    colors={colors}
                    font={font}
                    font_sizes={font_sizes}
                    {...props}
                  />
                )
              }
            />
          }
          {<Route path="/roughwork" element={<RoughWork {...props} />} />}
          <Route path="/" element={<MainPage $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props} />} />
        </Routes>
      </div>
      <div className="footer">
        <div className="footer-para">This is project is done as part of the module "CO7201 MSc Individual Project" by "Vamsi Krishna Palaparti, Msc in Advanced Computer Science, University of Leicester."</div>
      </div>
    </AppDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(App);
