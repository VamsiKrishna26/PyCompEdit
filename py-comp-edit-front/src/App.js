import React, { useState } from "react";
import styled from "styled-components";
import Editor from "./pages/Editor/Editor";
import './App.scss';
import Navbar from "./pages/Nav/Navbar";
import { createStructuredSelector } from "reselect";
import { selectUser } from "./redux/user/user.selecter";
import { connect } from "react-redux";
import { Route, Routes } from "react-router";
import Submissions from "./pages/Submissions/Submissions";
import Discussions from "./pages/Discussions/Discussions";

const AppDiv = styled.div`

  .body{
    background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark_bg : props.colors.white};
  }

`;

const App = (props) => {

  const { user } = props;

  let [darkThemeHome, setDarkThemeHome] = useState(true);

  let colors = { dark: "rgb(66,66,66)", white: "white", theme: "#4b0082", black: "black", dark_bg: "rgb(128, 128, 128)" };

  let font_sizes = { heading1: "28px", heading2: "24px", heading3: "20px", heading4: "18px", text: "16px" };

  let font = "'Kantumruy Pro', sans-serif";

  return (
    <AppDiv $darkThemeHome={darkThemeHome} colors={colors}>
      <div className="body">
        <Navbar hideNavbar={false} showMessage={false} showModal={false} $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props} />
        <Routes>
          <Route path="/editor" element={<Editor $darkThemeHome={darkThemeHome} colors={colors} {...props} />} />
          {
            <Route path="/submissions" element={user ? <Submissions $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props} /> 
            : <Navbar hideNavbar={true} showMessage={true} showModal={true} $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props} />} />
          }
          <Route path='/discussions' element={<Discussions $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props}/>}/>
          <Route path="/" element={<p>Hello</p>} />
        </Routes>
      </div>
    </AppDiv>
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectUser
})

export default connect(mapStateToProps)(App);