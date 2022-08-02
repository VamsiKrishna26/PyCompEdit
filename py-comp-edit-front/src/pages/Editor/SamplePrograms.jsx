import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import configData from "../../config.json";
import { Accordion } from "react-bootstrap";

const SampleProgramsDiv = styled.div`
  border-radius: 15px 15px 15px 15px;
  border: ${(props) =>
    props.darkTheme
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  padding: 0.5em;
  margin:0.5em;
  font-family: ${(props) => props.fontFamily};
  font-weight: ${(props) => props.fontWeight};
  color: ${(props) =>
    props.darkTheme ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.darkTheme ? props.colors.dark : props.colors.white};
  max-height: 550px;
  overflow-y: auto;
  .language {
    font-weight: bold;
  }
  .title {
    font-size: smaller;
    margin-left: 0.45em;
    cursor: pointer;
  }

  .accordion {
    font-family: ${(props) => props.font};
    --bs-accordion-border-color: ${(props) =>
      props.darkTheme
        ? `${props.colors.black}`
        : `${props.colors.theme}`} !important;
    --bs-accordion-color: ${(props) =>
      props.darkTheme
        ? props.colors.white
        : props.colors.black} !important;
    --bs-accordion-bg: ${(props) =>
      props.darkTheme ? props.colors.dark : props.colors.white} !important;
    .accordion-body {
      /* border: 1px solid red; */
      padding: 0.5em !important;
    }
    .accordion-button {
        padding: 0.5em !important;
      color: ${(props) =>
        props.darkTheme
          ? `${props.colors.white}`
          : `${props.colors.black}`} !important;
      :not(.collapsed) {
        color: ${(props) => props.colors.black} !important;
      }
    }
    .accordion-item{
        margin-top: 0.5em;
    }
  }

  @media only screen and (max-width: 768px) {
    .accordion {
      .accordion-body {
        padding: 0.3em !important;
      }
    }
  }
`;

const SamplePrograms = (props) => {
  const {
    fontFamily,
    fontSize,
    darkTheme,
    fontWeight,
    colors,
    setLanguage,
    setFileName,
    setNotes,
    setSampleProgram,
  } = props;

  const [programs, setPrograms] = useState([]);

  const languages_list = {
    Python: "Python (3.8.1)",
    Java: "Java (OpenJDK 13.0.1)",
    JavaScript: "JavaScript (Node.js 12.14.0)",
    CSharp: "JavaScript (Node.js 12.14.0)",
    Cpp: "C++ (GCC 9.2.0)",
    C: "C (GCC 9.2.0)",
  };

  useEffect(() => {
    axios
      .get(configData.PORT + "/programs", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setPrograms(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  //   useEffect(() => {
  //     console.log(programs);
  //   }, [programs]);

  const setProgram = (language, program) => {
    setLanguage(language);
    setFileName(program.title);
    setNotes(program.notes);
    setSampleProgram(program.source_code);
    // console.log(languages_list[language],program.title,program.notes,program.source_code)
  };

  return (
    <SampleProgramsDiv
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      darkTheme={darkTheme}
      colors={colors}
    >
      {programs.length !== 0 ? (
        <div className="programs">
          <p className="language">Sample Programs: (Try them)</p>
          <Accordion defaultActiveKey={0}>
            {programs.map((language, index) => (
              <div key={language.language}>
                <Accordion.Item eventKey={index}>
                  <Accordion.Header>
                    <p className="language">{language.language}</p>
                  </Accordion.Header>
                  <Accordion.Body>
                    {language.programs.map((program, index) => (
                      <div key={`${language.language} ${program.title}`}>
                        <p
                          className="title"
                          onClick={() => setProgram(language.language, program)}
                        >
                          {program.title}
                        </p>
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </div>
            ))}
          </Accordion>
        </div>
      ) : (
        <div>
          <p>No programs available. Try again later!!</p>
        </div>
      )}
    </SampleProgramsDiv>
  );
};

export default SamplePrograms;
