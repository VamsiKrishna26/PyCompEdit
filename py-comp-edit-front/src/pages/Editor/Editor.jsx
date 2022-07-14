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

const EditorDiv = styled.div`
  .editor-area {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: auto;

    .editor {
      margin: 1em;
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
      justify-content: ${(props) =>
        props.isFetching ? "center" : "flex-start"};
      margin: 1em;
      position: relative;
      border-radius: 15px 15px 15px 15px;
      border: 1px solid
        ${(props) =>
          props.darkTheme ? props.colors.black : props.colors.theme};
      padding: 1em;
      background-color: ${(props) =>
        props.darkTheme ? props.colors.dark : props.colors.white};
      min-height: 200px !important;
      max-height: 400px !important;
      overflow-y: auto;
      width: auto;
      position: relative;
    }
  }
`;

const StyledFormControl = styled(Form.Control)`
  width: 320px;
  :focus {
    font-family: ${(props) => props.fontFamily};
    color: ${(props) =>
      props.$darkTheme ? props.colors.white : props.colors.black};
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.dark : props.colors.white};
  }
  :not(active) {
    font-family: ${(props) => props.fontFamily};
    color: ${(props) =>
      props.$darkTheme ? props.colors.white : props.colors.black};
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.dark : props.colors.white};
  }
  @media only screen and (max-width: 768px) {
    width: 130px;
  }
`;

const StyledDownloadButton = styled(Button)`
  font-family: ${(props) => props.fontFamily};
  color: ${(props) =>
    props.$darkTheme ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
  margin-left: 0.5em;
  border: ${(props) =>
    props.$darkTheme ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`};
  :hover {
    color: ${(props) =>
      props.$darkTheme ? props.colors.black : props.colors.white};
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.white : props.colors.dark};
    border: ${(props) =>
      props.$darkTheme ? `1px solid ${props.colors.theme}` : `1px solid ${props.colors.black}`};
  }
`;

const Editor = (props) => {
  const { $darkThemeHome, user } = props;

  const location = useLocation();

  useEffect(() => {
    setDarkTheme($darkThemeHome);
  }, []);

  useEffect(() => {
    console.log(location.state);
  }, [location.state]);

  // useEffect(()=>{console.log(user.userId)},[user]);

  let [codeString, setCodeString] = useState(null);

  let [fontFamily, setFontFamily] = useState(
    JSON.parse(localStorage.getItem("font_family")) ||
      "'Source Code Pro', monospace"
  );

  let [fontWeight, setFontWeight] = useState(
    JSON.parse(localStorage.getItem("font_weight")) || 400
  );

  let [fontSize, setFontSize] = useState(
    JSON.parse(localStorage.getItem("font_size")) || "16px"
  );

  let [language, setLanguage] = useState(location.state
    ? location.state.language
    :JSON.parse(localStorage.getItem("language")) || "Python"
  );

  let [darkTheme, setDarkTheme] = useState(
    JSON.parse(localStorage.getItem("dark_theme")) || false
  );

  let [result, setResult] = useState(
    location.state ? location.state : {}
  );

  let [isFetching, setIsFetching] = useState(false);

  let [uploadFileText, setUploadFileText] = useState(null);

  let [timeDifference, setTimeDifference] = useState(0);

  let [stdin, setStdin] = useState(
    location.state
      ? location.state.stdin
      : JSON.parse(localStorage.getItem("stdin")) || ""
  );

  let [fileName, setFileName] = useState(
    location.state
      ? location.state.fileName
      : JSON.parse(localStorage.getItem("fileName")) || "Script1"
  );

  let [notes, setNotes] = useState(
    location.state
      ? location.state.notes
      : JSON.parse(localStorage.getItem("notes")) || ""
  );

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
    fetch("http://localhost:1020/submit", {
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

  const uploadFile = async (e) => {
    try {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        setUploadFileText(text);
      };
      reader.readAsText(e.target.files[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let code = JSON.parse(localStorage.getItem("code"));
    if (location.state) {
      setUploadFileText(location.state.source_code);
    } else if (code && code[language]) {
      code[language] = code[language]
        .map((node) => Node.string(node))
        .join("\n");
      while (code[language].substring(0, 1) === "\n") {
        code[language] = code[language].substring(1);
      }
      setUploadFileText(code[language]);
    } else {
      if (language === "Java") {
        setUploadFileText(
          "public class Main{\n    public static void main(String[] args){\n        //Type your code here. Main class should be present.\n    }\n}"
        );
      } else if (language === "Python") {
        setUploadFileText("#Type your code here\n\nprint('Hello World!!!')");
      } else if (language === "JavaScript") {
        setUploadFileText(
          '//Type your code here\n\nconsole.log("Hello World!!!")'
        );
      } else if (language === "CSharp") {
        setUploadFileText(
          'using System;\nnamespace Main{\n    class Program{\n        static void Main(string[] args){\n            Console.WriteLine("Hello World!");\n        }\n    }\n}'
        );
      } else if (language === "Cpp") {
        setUploadFileText(
          '#include <iostream>\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}'
        );
      } else if (language === "C") {
        setUploadFileText(
          '#include <stdio.h>\nint main() {\n    printf("Hello, World!");\n    return 0;\n}'
        );
      }
    }
  }, [language]);

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([codeString], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    let file_extension = {
      Python: ".py",
      Java: ".java",
      JavaScript: ".js",
      CSharp: ".cs",
      Cpp: ".cpp",
      C: ".c",
    };
    element.download = `${fileName}${file_extension[language]}`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <EditorDiv
      darkTheme={darkTheme}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      isFetching={isFetching}
      {...props}
    >
      <div className="editor-area">
        <div className="editor">
          <div>
            <Form.Group className="button-area">
              <div className="upload">
                {window.screen.width >= 768 ? (
                  <Form.Label className="upload-label">
                    Upload a Local File:{" "}
                  </Form.Label>
                ) : null}
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
              <StyledDownloadButton
                variant="custom"
                fontFamily={fontFamily}
                $darkTheme={darkTheme}
                onClick={downloadFile}
                colors={props.colors}
              >
                {window.screen.width >= 768 ? `Download the file` : `Download`}
              </StyledDownloadButton>
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
            {...props}
          />
          <div className="save_dark">
            <div>
              <label>Dark Theme:</label>
              <label className="switch-wrap">
                <input
                  checked={darkTheme}
                  onChange={() => {
                    localStorage.setItem(
                      "dark_theme",
                      JSON.stringify(!darkTheme)
                    );
                    setDarkTheme(!darkTheme);
                  }}
                  type="checkbox"
                />
                <div className="switch"></div>
              </label>
            </div>
            <span className="time-difference">{`Saved ${timeDifference} seconds ago...`}</span>
          </div>
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
            submission={location.state?location.state:null}
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
            submission={location.state?location.state:null}
            {...props}
          />
        </div>
        <RunButton
          fontFamily={fontFamily}
          fontSize={fontSize}
          darkTheme={darkTheme}
          fontWeight={fontWeight}
          fetchSubmission={fetchSubmission}
          submission={location.state?location.state:null}
          {...props}
        />
        <div className="display">
          {!isFetching ? (
            <DisplayResult
              {...props}
              fontFamily={fontFamily}
              fontSize={fontSize}
              darkTheme={darkTheme}
              fontWeight={fontWeight}
              result={result}
              submission={location.state?location.state:null}
              {...props}
            />
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
