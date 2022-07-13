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

const AppDiv = styled.div`

`;

const App = (props) =>{

  const {user}=props;

  let [darkThemeHome,setDarkThemeHome]=useState(false);

  let colors={dark:"rgb(66,66,66)",white:"white",theme:"#4b0082",black:"black"};

  let font_sizes={heading1:"28px",heading2:"24px",heading3:"20px",heading4:"18px",text:"16px"};

  let font="'Kantumruy Pro', sans-serif";

  return(
    <AppDiv>
      <Navbar $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props}/>
      <Routes>
        <Route path="/editor" element={<Editor $darkThemeHome={darkThemeHome} colors={colors} {...props}/>}/>
        {
          user?
          <Route path="/submissions" element={<Submissions $darkThemeHome={darkThemeHome} colors={colors} font={font} font_sizes={font_sizes} {...props}/>}/>:
          null
        }
        <Route path="/" element={<p>Hello</p>}/>
      </Routes>
    </AppDiv>
  )
}

const mapStateToProps=createStructuredSelector({
  user:selectUser
})

export default connect(mapStateToProps)(App);