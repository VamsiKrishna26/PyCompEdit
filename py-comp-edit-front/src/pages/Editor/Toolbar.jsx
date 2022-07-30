import React, { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import styled from "styled-components";

const ToolbarDiv = styled.div`
  .toolbar-div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    flex-wrap: wrap;

    .toolbar-divs {
      display:flex;
      .dropdown {
        margin: 0.5em;
      }
    }
  }

  
`;

const StyledDropDownToggle = styled(Dropdown.Toggle)`
  font-family: ${(props) => props.fontFamily};
  color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.black)};
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
  border: ${(props) => (props.$darkTheme ?`1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  :focus {
    font-family: ${(props) => props.fontFamily} !important;
    color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.black)} !important;
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.dark : props.colors.white} !important;
  }
  :hover {
    color: ${(props) => (props.$darkTheme ? props.colors.black : props.colors.white)};
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.white : props.colors.dark};
  }
`;

const StyledDropDownMenu = styled(Dropdown.Menu)`
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
`;

const StyledDropDownItem = styled(Dropdown.Item)`
  font-family: ${(props) => props.fontFamily};
  color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.black)};
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
`;

const Toolbar = (props) => {
  const {
    changeFontSize,
    fontSize,
    fontFamily,
    darkTheme,
    changeFontWeight,
    fontWeight,
    changeFontFamily,
    language,
    changeLanguage,
    submission
  } = props;

  const font_families_list = [
    "'Source Code Pro', monospace",
    "'JetBrains Mono', monospace",
    "'Roboto Mono', monospace",
    "'Ubuntu Mono', monospace",
    "'Kanit', sans-serif",
    "'Lato', sans-serif",
    "'Lora', serif",
    "'Raleway', sans-serif",
    "'Roboto', sans-serif",
    "'Ubuntu', sans-serif",
    "'Mukta', sans-serif",
    "'Nunito Sans', sans-serif",
  ];

  const languages_list = {
    Python: "Python",
    Java: "Java",
    JavaScript: "JavaScript",
    CSharp: "CSharp",
    Cpp: "C++",
    C: "C",
  };

  const languages = (props) => {
    let langauges = [];
    for (var key in languages_list) {
      langauges.push(
        <StyledDropDownItem
          fontFamily={fontFamily}
          $darkTheme={darkTheme}
          eventKey={key}
          key={key}
          colors={props.colors}
        >
          {languages_list[key]}
        </StyledDropDownItem>
      );
    }
    return langauges;
  };

  const font_sizes = (props) => {
    let fontSizes = [];
    for (var i = 10; i <= 28; i += 2) {
      fontSizes.push(
        <StyledDropDownItem
          fontFamily={fontFamily}
          $darkTheme={darkTheme}
          eventKey={i}
          key={i}
          colors={props.colors}
        >
          {i}
        </StyledDropDownItem>
      );
    }
    return fontSizes;
  };

  const font_weights = (props) => {
    let fontWeights = [];
    for (var i = 100; i <= 900; i += 100) {
      fontWeights.push(
        <StyledDropDownItem
          fontFamily={fontFamily}
          $darkTheme={darkTheme}
          eventKey={i}
          key={i}
          colors={props.colors}
        >
          {i}
        </StyledDropDownItem>
      );
    }
    return fontWeights;
  };

  useEffect(() => {}, [window.screen.width]);

  const font_families = (props) => {
    let fontFamilies = [];
    for (var i = 0; i < font_families_list.length; i += 1) {
      fontFamilies.push(
        <StyledDropDownItem
          fontFamily={font_families_list[i]}
          $darkTheme={darkTheme}
          eventKey={font_families_list[i]}
          key={font_families_list[i]}
          colors={props.colors}
        >
          {font_families_list[i]}
        </StyledDropDownItem>
      );
    }
    return fontFamilies;
  };

  return (
    <ToolbarDiv>
      <div className="toolbar-div">
        <div className="toolbar-divs">
          <Dropdown
            variant="custom"
            onSelect={changeLanguage}
            className="dropdown"
          >
            <StyledDropDownToggle
              fontFamily={fontFamily}
              $darkTheme={darkTheme}
              colors={props.colors}
              disabled={submission ? submission.readOnly : false}
            >
              {window.screen.width >= 768
                ? `Language: ${language}`
                : `${language}`}
            </StyledDropDownToggle>

            <StyledDropDownMenu $darkTheme={darkTheme} colors={props.colors}>
              {languages({...props})}
            </StyledDropDownMenu>
          </Dropdown>
          <Dropdown
            variant="custom"
            onSelect={changeFontFamily}
            className="dropdown"
          >
            <StyledDropDownToggle
              className="dropdown-font"
              fontFamily={fontFamily}
              $darkTheme={darkTheme}
              colors={props.colors}
            >
              {window.screen.width >= 768
                ? `Font: ${fontFamily.match(/'[\w ]+'/)}`
                : `${fontFamily.match(/'[\w ]+'/)}`}
            </StyledDropDownToggle>

            <StyledDropDownMenu $darkTheme={darkTheme} colors={props.colors}>
              {font_families({...props})} 
            </StyledDropDownMenu>
          </Dropdown>
        </div>
        <div className="toolbar-divs">
          <Dropdown
            variant="custom"
            onSelect={changeFontSize}
            className="dropdown"
          >
            <StyledDropDownToggle
              fontFamily={fontFamily}
              $darkTheme={darkTheme}
              colors={props.colors}
            >
              {window.screen.width >= 768
                ? `Font-size: ${fontSize.slice(0, 2)}`
                : `${fontSize.slice(0, 2)}`}
            </StyledDropDownToggle>

            <StyledDropDownMenu $darkTheme={darkTheme} colors={props.colors}>
              {font_sizes({...props})}
            </StyledDropDownMenu>
          </Dropdown>
          <Dropdown variant="custom" onSelect={changeFontWeight}>
            <StyledDropDownToggle
              fontFamily={fontFamily}
              $darkTheme={darkTheme}
              colors={props.colors}
            >
              {window.screen.width >= 768
                ? `Font-weight: ${fontWeight}`
                : `${fontWeight}`}
            </StyledDropDownToggle>

            <StyledDropDownMenu $darkTheme={darkTheme} colors={props.colors}>
              {font_weights({...props})}
            </StyledDropDownMenu>
          </Dropdown>
        </div>
      </div>
    </ToolbarDiv>
  );
};

export default Toolbar;
