import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Node } from "slate";
import styled from "styled-components";
import DisplayResult from "./DisplayResult";
import Inputs from "./Inputs";
import LoadingScreen from "./LoadingScreen";
import RunButton from "./RunButton";
import TextEditor from "./TextEditor";
import Toolbar from "./Toolbar";
import "./Editor.scss";
import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/user/user.selecter";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import configData from "../../config.json";
import SamplePrograms from "./SamplePrograms";

const EditorDiv = styled.div`
  padding: 1em;
  .editor-area {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: auto;

    .editor {
      position: relative;
      display: flex;
      flex-direction: column;

      .time-difference {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 0.35em;
        margin-right: 1.5em;
      }

      .button-area {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 0.4em;

        .upload {
          display: flex;
          align-items: flex-end;
          .upload-label {
            font-family: ${(props) => props.fontFamily};
            margin-right: 0.5em;
          }
        }
      }

      .save_dark {
        margin-left: 1em;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .display {
      display: flex;
      align-items: ${(props) => (props.isFetching ? "center" : "flex-start")};
      justify-content: ${(props) => (props.isFetching ? "center" : "flex-start")};
      margin: 1em;
      position: relative;
      border-radius: 15px 15px 15px 15px;
      border: 1px solid ${(props) => (props.darkTheme ? props.colors.black : props.colors.theme)};
      padding: 1em;
      background-color: ${(props) => (props.darkTheme ? props.colors.dark : props.colors.white)};
      min-height: 200px !important;
      max-height: 400px !important;
      overflow-y: auto;
      width: auto;
      position: relative;
    }
    .text-editor-sample-programs {
      display: flex;
      flex-direction: row;
      .sample {
        flex: 0.3;
      }
      .editor-text {
        flex: 1;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .save_dark {
      margin-left: 0.5em !important;
      .time-difference {
        margin-right: 0.5em !important;
      }
    }
  }
  .display {
    margin: 0.5em 0em 0.5em 0em !important;
  }
`;

const StyledFormControl = styled(Form.Control)`
  width: 320px;
  :focus {
    font-family: ${(props) => props.fontFamily};
    color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.black)};
    background-color: ${(props) => (props.$darkTheme ? props.colors.dark : props.colors.white)};
  }
  :not(active) {
    font-family: ${(props) => props.fontFamily};
    color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.black)};
    background-color: ${(props) => (props.$darkTheme ? props.colors.dark : props.colors.white)};
  }
  @media only screen and (max-width: 768px) {
    width: 130px;
  }
`;

const StyledDownloadButton = styled(Button)`
  font-family: ${(props) => props.fontFamily};
  color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.black)};
  background-color: ${(props) => (props.$darkTheme ? props.colors.dark : props.colors.white)};
  margin-left: 0.5em;
  border: ${(props) => (props.$darkTheme ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  :hover {
    color: ${(props) => (props.$darkTheme ? props.colors.black : props.colors.white)};
    background-color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.theme)};
    border: ${(props) => (props.$darkTheme ? `1px solid ${props.colors.theme}` : `1px solid ${props.colors.black}`)};
  }
`;

const Editor = (props) => {
  const { $darkThemeHome, user } = props;

  useEffect(() => {
    document.title = "Editor - PyCompEdit";
  }, []);

  const location = useLocation();

  useEffect(() => {
    setDarkTheme($darkThemeHome);
  }, []);

  // useEffect(()=>{console.log(user.userId)},[user]);

  let [codeString, setCodeString] = useState(null);

  let [fontFamily, setFontFamily] = useState(JSON.parse(localStorage.getItem("font_family")) || "'Source Code Pro', monospace");

  let [fontWeight, setFontWeight] = useState(JSON.parse(localStorage.getItem("font_weight")) || 400);

  let [fontSize, setFontSize] = useState(JSON.parse(localStorage.getItem("font_size")) || "16px");

  let [language, setLanguage] = useState(location.state ? location.state.language : JSON.parse(localStorage.getItem("language")) || "Python (3.8.1)");

  useEffect(() => {
    console.log(location.state ? location.state.language : JSON.parse(localStorage.getItem("language")) || "Python (3.8.1)");
  }, [language]);

  let [darkTheme, setDarkTheme] = useState(JSON.parse(localStorage.getItem("dark_theme")) || false);

  let [readOnly, setReadOnly] = useState(location.state ? location.state.readOnly : true);

  let [result, setResult] = useState(location.state ? location.state : {});

  let [isFetching, setIsFetching] = useState(false);

  let [uploadFileText, setUploadFileText] = useState(null);

  let [timeDifference, setTimeDifference] = useState(0);

  let [sampleProgram, setSampleProgram] = useState(null);

  let [stdin, setStdin] = useState(location.state ? location.state.stdin : JSON.parse(localStorage.getItem("stdin")) || "");

  let [fileName, setFileName] = useState(location.state ? location.state.fileName : JSON.parse(localStorage.getItem("fileName")) || "Script1");

  let [notes, setNotes] = useState(location.state ? location.state.notes : JSON.parse(localStorage.getItem("notes")) || "");

  const codeStringChange = (code) => {
    setCodeString(code.map((node) => Node.string(node)).join("\n"));
  };

  const changeFontSize = (size) => {
    if (size) setFontSize(size + "px");
  };

  useEffect(() => {
    localStorage.setItem("font_size", JSON.stringify(fontSize));
  }, [fontSize]);

  const changeFontWeight = (weight) => {
    if (weight) setFontWeight(weight);
  };

  useEffect(() => {
    localStorage.setItem("font_weight", JSON.stringify(fontWeight));
  }, [fontWeight]);

  const changeLanguage = (language) => {
    // console.log(language);
    if (language) setLanguage(language);
  };

  useEffect(() => {
    localStorage.setItem("language", JSON.stringify(language));
  }, [language]);

  const changeFontFamily = (font) => {
    if (font) setFontFamily(font);
  };

  useEffect(() => {
    localStorage.setItem("font_family", JSON.stringify(fontFamily));
  }, [fontFamily]);

  const fetchSubmission = () => {
    setIsFetching(true);
    fetch(configData.PORT + "/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user ? user.userId : undefined,
        fileName: fileName,
        notes: notes,
        source_code: codeString,
        stdin: stdin,
        language: language,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResult(data);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setResult({ stderr: error.response.data.message });
        setIsFetching(false);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
  };

  const uploadFile = async (e) => {
    setUploadFileText("");
    let file_extension = {
      py: "Python (3.8.1)",
      java: "Java (OpenJDK 13.0.1)",
      js: "JavaScript (Node.js 12.14.0)",
      cs: "CSharp (Mono 6.6.0.161)",
      cpp: "Cpp (GCC 9.2.0)",
      c: "C (GCC 9.2.0)",
    };
    try {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        setUploadFileText(text);
      };
      reader.readAsText(e.target.files[0]);
      var file = e.target.files[0];
      var fileName = file.name;
      setLanguage(file_extension[fileName.split(".").pop()]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let code = JSON.parse(localStorage.getItem("code"));
    if (sampleProgram && sampleProgram.language === language) {
      setUploadFileText(sampleProgram.source_code);
    } else if (location.state && location.state.language === language) {
      setUploadFileText(location.state.source_code);
    } else if (code && code[language]) {
      code[language] = code[language].map((node) => Node.string(node)).join("\n");
      while (code[language].substring(0, 1) === "\n") {
        code[language] = code[language].substring(1);
      }
      setUploadFileText(code[language]);
    } else {
      if (language === "Java (OpenJDK 13.0.1)") {
        setUploadFileText(
          "public class Main{\n    public static void main(String[] args){\n        //Type your code here. Main class should be present.\n    }\n}"
        );
      } else if (language === "Python (3.8.1)") {
        setUploadFileText("#Type your code here\n\nprint('Hello World!!!')");
      } else if (language === "JavaScript (Node.js 12.14.0)") {
        setUploadFileText('//Type your code here\n\nconsole.log("Hello World!!!")');
      } else if (language === "C# (Mono 6.6.0.161)") {
        setUploadFileText(
          'using System;\nnamespace Main{\n    class Program{\n        static void Main(string[] args){\n            Console.WriteLine("Hello World!");\n        }\n    }\n}'
        );
      } else if (language === "C++ (GCC 9.2.0)") {
        setUploadFileText('#include <iostream>\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}');
      } else if (language === "C (GCC 9.2.0)") {
        setUploadFileText('#include <stdio.h>\nint main() {\n    printf("Hello, World!");\n    return 0;\n}');
      }
    }
  }, [language, sampleProgram]);

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([codeString], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    let file_extension = {
      "Python (3.8.1)": ".py",
      "Java (OpenJDK 13.0.1)": ".java",
      "JavaScript (Node.js 12.14.0)": ".js",
      "C# (Mono 6.6.0.161)": ".cs",
      "C++ (GCC 9.2.0)": ".cpp",
      "C (GCC 9.2.0)": ".c",
    };
    element.download = `${fileName}${file_extension[language]}`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <EditorDiv darkTheme={darkTheme} fontFamily={fontFamily} fontSize={fontSize} fontWeight={fontWeight} isFetching={isFetching} {...props}>
      <div className="editor-area">
        <div className="editor">
          <div>
            <Form.Group className="button-area">
              <div className="upload">
                {window.screen.width >= 768 ? <Form.Label className="upload-label">Upload a Local File: </Form.Label> : null}
                <StyledFormControl
                  id="uploadFile"
                  fontFamily={fontFamily}
                  $darkTheme={darkTheme}
                  type="file"
                  accept=".py,.java,.js,.cs,.cpp,.c"
                  onChange={uploadFile}
                  colors={props.colors}
                />
              </div>
              <StyledDownloadButton variant="custom" fontFamily={fontFamily} $darkTheme={darkTheme} onClick={downloadFile} colors={props.colors}>
                {window.screen.width >= 768 ? `Download the file` : `Download`}
              </StyledDownloadButton>
              {readOnly ? (
                <StyledDownloadButton
                  variant="custom"
                  fontFamily={fontFamily}
                  $darkTheme={darkTheme}
                  onClick={() => {
                    setReadOnly(false);
                  }}
                  colors={props.colors}
                >
                  {window.screen.width >= 768 ? `Edit the file` : `Edit`}
                </StyledDownloadButton>
              ) : (
                <StyledDownloadButton
                  variant="custom"
                  fontFamily={fontFamily}
                  $darkTheme={darkTheme}
                  onClick={() => {
                    setReadOnly(true);
                  }}
                  colors={props.colors}
                >
                  {window.screen.width >= 768 ? `Lock the edit` : `Lock`}
                </StyledDownloadButton>
              )}
            </Form.Group>
          </div>
          <Toolbar
            {...props}
            fontFamily={fontFamily}
            fontSize={fontSize}
            darkTheme={darkTheme}
            fontWeight={fontWeight}
            language={language}
            changeFontSize={changeFontSize}
            changeFontWeight={changeFontWeight}
            changeFontFamily={changeFontFamily}
            changeLanguage={changeLanguage}
            readOnly={readOnly}
            {...props}
          />
          <div className="save_dark">
            <div>
              <label>Dark Theme:</label>
              <label className="switch-wrap">
                <input
                  checked={darkTheme}
                  onChange={() => {
                    localStorage.setItem("dark_theme", JSON.stringify(!darkTheme));
                    setDarkTheme(!darkTheme);
                  }}
                  type="checkbox"
                />
                <div className="switch"></div>
              </label>
            </div>
            <span className="time-difference">{`Saved ${timeDifference} seconds ago...`}</span>
          </div>
          <div className="text-editor-sample-programs">
            {window.screen.width >= 768 ? (
              <div className="sample">
                <SamplePrograms
                  {...props}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  darkTheme={darkTheme}
                  fontWeight={fontWeight}
                  setLanguage={setLanguage}
                  setFileName={setFileName}
                  setNotes={setNotes}
                  setSampleProgram={setSampleProgram}
                />
              </div>
            ) : null}
            <div className="editor-text">
              <TextEditor
                uploadFileText={uploadFileText}
                fontFamily={fontFamily}
                fontSize={fontSize}
                darkTheme={darkTheme}
                fontWeight={fontWeight}
                codeStringChange={codeStringChange}
                result={result}
                setTimeDifference={setTimeDifference}
                language={language}
                readOnly={readOnly}
                copyToClipboard={copyToClipboard}
                {...props}
              />

              <Inputs
                fontFamily={fontFamily}
                fontSize={fontSize}
                darkTheme={darkTheme}
                fontWeight={fontWeight}
                setStdin={setStdin}
                setFileName={setFileName}
                setNotes={setNotes}
                stdin={stdin}
                fileName={fileName}
                notes={notes}
                readOnly={readOnly}
                {...props}
              />
            </div>
          </div>
        </div>
        {!readOnly ? (
          <RunButton fontFamily={fontFamily} fontSize={fontSize} darkTheme={darkTheme} fontWeight={fontWeight} fetchSubmission={fetchSubmission} {...props} />
        ) : null}
        <div className="display">
          {!isFetching ? (
            <DisplayResult {...props} fontFamily={fontFamily} fontSize={fontSize} darkTheme={darkTheme} fontWeight={fontWeight} result={result} {...props} />
          ) : (
            <LoadingScreen darkTheme={darkTheme} />
          )}
        </div>
      </div>
    </EditorDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(Editor);
