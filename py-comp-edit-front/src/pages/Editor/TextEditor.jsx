import React, { useCallback, useEffect, useState } from "react";
import { createEditor, Text, Transforms, Editor, Node } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import * as Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import { css } from "@emotion/css";
import { BsSearch } from "react-icons/bs";
import { TiTimes } from "react-icons/ti";
import { IoCopy } from "react-icons/io5";
import { FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router";

const TextEditorDiv = styled.div`
  .text-editor-div {
    display: flex;
    flex-direction: column;
    border-radius: 15px 15px 15px 15px;
    border: ${(props) => (props.darkTheme ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
    padding: 1em;
    font-family: ${(props) => props.fontFamily};
    font-size: ${(props) => props.fontSize};
    font-weight: ${(props) => props.fontWeight};
    color: ${(props) => (props.darkTheme ? props.colors.white : props.colors.black)};
    background-color: ${(props) => (props.darkTheme ? props.colors.dark : props.colors.white)};
    min-height: 400px !important;
    max-height: 800px !important;
    width: auto;
    position: relative;
    margin-top: 0.5em;
    margin-bottom: 1em;

    .stdin_file-name {
      align-self: flex-end;
      border-radius: 15px 15px 15px 15px;
      width: 350px;
      border: ${(props) => (props.darkTheme ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
      padding: 0.3em;
      background-color: ${(props) => (props.darkTheme ? props.colors.dark : props.colors.white)};
      font-family: ${(props) => props.fontFamily};
      font-size: ${(props) => props.fontSize};
      font-weight: ${(props) => props.fontWeight};
      color: ${(props) => (props.darkTheme ? props.colors.white : props.colors.black)};
      margin: 0.3em;
    }

    .text-editor-div-div {
      display: flex;
      overflow-y: auto;
      .line-numbers {
        padding-left: 0.5em;
        flex: 0.05;
      }

      .text-editor {
        flex: 0.95;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        position: relative;
        /* border:1px solid red; */

        .text-area {
          /* border: 1px solid red; */
        }
      }
    }
  }

  .icon {
    color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.theme)};
    cursor: pointer;
    margin: 0.3em;
    font-size: larger;
  }

  @media only screen and (max-width: 768px) {
    .text-editor-div {
      padding: 0.5em;
    }
  }
`;

const StyledDownloadButton = styled(Button)`
  font-family: ${(props) => props.fontFamily};
  align-self: flex-end;
  order: 1;
  color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.black)};
  background-color: ${(props) => (props.$darkTheme ? props.colors.dark : props.colors.white)};
  margin-left: 0.5em;
  border: ${(props) => (props.$darkTheme ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  :hover {
    color: ${(props) => (props.$darkTheme ? props.colors.black : props.colors.white)};
    background-color: ${(props) => (props.$darkTheme ? props.colors.white : props.colors.dark)};
  }
`;

Prism.languages.python = Prism.languages.extend("python", {});
Prism.languages.insertBefore("python", "prolog", {
  comment: { pattern: /##[^\n]*/, alias: "comment" },
});

Prism.languages.javascript = Prism.languages.extend("javascript", {});
Prism.languages.java = Prism.languages.extend("java", {});
Prism.languages.sql = Prism.languages.extend("sql", {});
Prism.languages.csharp = Prism.languages.extend("csharp", {});
Prism.languages.cpp = Prism.languages.extend("cpp", {});
Prism.languages.c = Prism.languages.extend("c", {});

const TextEditor = (props) => {
  const {
    fontFamily,
    fontSize,
    darkTheme,
    codeStringChange,
    // result,
    fontWeight,
    uploadFileText,
    setTimeDifference,
    readOnly,
    // language
    copyToClipboard,
  } = props;

  const language = props.language || "python";

  // result.stderr='Traceback (most recent call last): File "script.py", line 97, in <module> first_player=prepare_cards() File "script.py", line 67, in prepare_cards shuffled=shuffle_card_deck(cards_deck) File "script.py", line 36, in shuffle_card_deck cards_list1[i]=cards_list2[m] NameError: name "m" is not defined';

  let [editor] = useState(() => withHistory(withReact(createEditor())), []);

  // let [lineNumberError, setLineNumberError] = useState();

  let [timer, setTimer] = useState(Math.floor(new Date().getTime()));

  let [presentTimer, setPresentTimer] = useState(Math.floor(new Date().getTime()));

  let [search, setSearch] = useState("");

  // useEffect(()=>{console.log(timer)},[timer]);

  let [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPresentTimer((presentTimer) => presentTimer + 15000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeDifference(Math.abs(Math.floor(presentTimer / 1000) - Math.floor(timer / 1000)));
  }, [presentTimer, timer]);

  useEffect(() => {
    if (uploadFileText) {
      let lines = uploadFileText.split("\n");
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
      for (var i = 0; i < lines.length; i++) {
        if (lines[i] === "\r") {
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }],
          });
        } else {
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: lines[i] }],
          });
        }
      }
    }
  }, [uploadFileText]);

  let [code, setCode] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  let [noOfLines, setNoOfLines] = useState(0);

  const navigate = useNavigate();

  const languages_list = {
    "Python (3.8.1)": "Python",
    "Java (OpenJDK 13.0.1)": "Java",
    "JavaScript (Node.js 12.14.0)": "JavaScript",
    "C# (Mono 6.6.0.161)": "CSharp",
    "C++ (GCC 9.2.0)": "Cpp",
    "C (GCC 9.2.0)": "C",
  };

  const Leaf = useCallback(
    ({ attributes, children, leaf }) => {
      return (
        <span
          {...attributes}
          className={css`
            ${leaf.comment &&
            css`
              color: #9f9698;
            `}
            ${(leaf.operator || leaf.url) &&
            css`
              color: ${props.darkTheme ? "#45b1dc" : "#6a3129"};
            `}
            ${leaf.keyword &&
            css`
              color: ${props.darkTheme ? "#56a6e2" : "#006699"};
            `}
            ${(leaf.variable || leaf.regex) &&
            css`
              color: ${props.darkTheme ? "#f82671" : "#19709b"};
            `}
            ${(leaf.number || leaf.boolean || leaf.tag || leaf.constant || leaf["attr-name"] || leaf.selector) &&
            css`
              color: ${props.darkTheme ? "#c39076" : "#2c2a97"};
            `}
            ${leaf.punctuation &&
            css`
              color: ${props.darkTheme ? "#ad56a4" : "#ff2c96"};
            `}
            ${(leaf.string || leaf.char) &&
            css`
              color: ${props.darkTheme ? "#2e8442" : "#048165"};
            `}
            ${(leaf.function || leaf["class-name"]) &&
            css`
              color: ${props.darkTheme ? "#dbdba3" : "#162f59"};
            `}
          ${leaf.searchHighlight &&
            css`
              background-color: ${props.darkTheme ? "white" : props.colors.theme};
              color: ${props.darkTheme ? "black" : "white"};
            `}
          `}
        >
          {children}
        </span>
      );
    },
    [language, search]
  );

  useEffect(() => {
    if (!showSearch) setSearch("");
  }, [showSearch]);

  const getLength = (token) => {
    if (typeof token === "string") {
      return token.length;
    } else if (typeof token.content === "string") {
      return token.content.length;
    } else {
      return token.content.reduce((l, t) => l + getLength(t), 0);
    }
  };

  useEffect(() => {
    setNoOfLines(editor.children.length);
  }, [editor.children]);

  const decorate = useCallback(
    ([node, path]) => {
      // console.log("called");
      const ranges = [];
      if (!Text.isText(node)) {
        return ranges;
      }
      const tokens = Prism.tokenize(node.text, Prism.languages[languages_list[language].toLowerCase()]);
      let start = 0;
      for (let token = 0; token < tokens.length; token++) {
        const length = getLength(tokens[token]);
        const end = start + length;
        if (typeof tokens[token] !== "string") {
          ranges.push({
            [tokens[token].type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          });
        }
        start = end;
      }
      if (search && search.length !== 0) {
        const { text } = node;
        const parts = text.split(search);
        let offset = 0;
        parts.forEach((part, i) => {
          if (i !== 0) {
            ranges.push({
              anchor: { path, offset: offset - search.length },
              focus: { path, offset },
              searchHighlight: true,
            });
          }
          offset = offset + part.length + search.length;
        });
      }
      return ranges;
    },
    [language, search]
  );

  const onKeyDown = (e) => {
    if (e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      let text = Editor.node(editor, editor.selection)[0].text;
      let diff = text.length - text.trimRight().length;
      editor.deleteBackward(4);
    } else if (e.key === "Tab") {
      e.preventDefault();
      editor.insertText("    ");
    } else if (e.key === "Enter") {
      e.preventDefault();
      try {
        let prev_node_text = Editor.node(editor, editor.selection)[0].text;
        let leading_spaces = prev_node_text.search(/\S|$/);
        if (leading_spaces === 0 || leading_spaces === 1) {
          var count = 0;
          var index = 0;
          while (prev_node_text.charAt(index++) === "\t") {
            count++;
          }
          console.log(count);
          leading_spaces = count * 4;
        }
        if (
          (language === "Python" && prev_node_text[prev_node_text.length - 1] === ":") ||
          (language !== "Python" && prev_node_text[prev_node_text.length - 1] === "{")
        ) {
          leading_spaces = leading_spaces === 0 ? 4 : (leading_spaces += 4);
        } else if (prev_node_text.match(/return/)) {
          leading_spaces = leading_spaces === 4 ? 0 : (leading_spaces -= 4);
        }
        Transforms.insertNodes(editor, {
          type: "paragraph",
          children: [{ text: " ".repeat(leading_spaces) }],
        });
      } catch {
        Transforms.insertNodes(editor, {
          type: "paragraph",
          children: [{ text: "" }],
        });
      }
    } else if (e.key === "{") {
      e.preventDefault();
      editor.insertText("{}");
      Transforms.move(editor, { distance: 1, reverse: true });
    } else if (e.key === "(") {
      e.preventDefault();
      editor.insertText("()");
      Transforms.move(editor, { distance: 1, reverse: true });
    } else if (e.key === "[") {
      e.preventDefault();
      editor.insertText("[]");
      Transforms.move(editor, { distance: 1, reverse: true });
    } else if (e.key === '"') {
      e.preventDefault();
      editor.insertText('""');
      Transforms.move(editor, { distance: 1, reverse: true });
    } else if (e.key === "'") {
      e.preventDefault();
      editor.insertText("''");
      Transforms.move(editor, { distance: 1, reverse: true });
    }
    let charCode = String.fromCharCode(e.which).toLowerCase();
    if ((e.ctrlKey || e.metaKey) && charCode === "s") {
      e.preventDefault();
      setCode(editor.children);
      setTimer(Math.floor(new Date().getTime()));
      setPresentTimer(Math.floor(new Date().getTime()));
      let prevCode = JSON.parse(localStorage.getItem("code"));
      localStorage.setItem(
        "code",
        JSON.stringify({
          ...prevCode,
          [language]: editor.children,
        })
      );
    } else if ((e.ctrlKey || e.metaKey) && charCode === "f") {
      e.preventDefault();
      setShowSearch(!showSearch);
    }
  };

  const saveCode = () => {
    setCode(editor.children);
    setTimer(Math.floor(new Date().getTime()));
    setPresentTimer(Math.floor(new Date().getTime()));
    let prevCode = JSON.parse(localStorage.getItem("code"));
    localStorage.setItem(
      "code",
      JSON.stringify({
        ...prevCode,
        [language]: editor.children,
      })
    );
  };

  useEffect(() => {
    codeStringChange(code);
  }, [code]);

  useEffect(() => {
    console.log("called");
  }, []);

  useEffect(() => {
    setCode(editor.children);
    const interval = setInterval(() => {
      setCode(editor.children);
      setTimer(Math.floor(new Date().getTime()));
      setPresentTimer(Math.floor(new Date().getTime()));
      let prevCode = JSON.parse(localStorage.getItem("code"));
      localStorage.setItem(
        "code",
        JSON.stringify({
          ...prevCode,
          [language]: editor.children,
        })
      );
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  const line_numbers = () => {
    let lineNumbers = [];
    noOfLines = noOfLines < 4 ? 4 : noOfLines;
    for (var i = 1; i <= noOfLines; i++) {
      lineNumbers.push(<div key={i}>{`${i}. `}</div>);
    }
    return lineNumbers;
  };

  return (
    <TextEditorDiv fontFamily={fontFamily} fontSize={fontSize} fontWeight={fontWeight} darkTheme={darkTheme} {...props}>
      <div className="text-editor-div">
        {showSearch ? (
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="stdin_file-name"
            type="text"
            name="search"
            spellCheck="false"
            placeholder="Search"
            value={search}
          />
        ) : null}
        <div className="text-editor-div-div">
          <div className="line-numbers">{line_numbers()}</div>
          <div className="text-editor">
            <Slate className="text-area" editor={editor} value={code}>
              <Editable
                decorate={decorate}
                renderLeaf={(props) => <Leaf {...props} />}
                onKeyDown={onKeyDown}
                placeholder="Code"
                spellCheck="false"
                onBlur={saveCode}
                readOnly={readOnly}
              ></Editable>
              {readOnly ? null : (
                <StyledDownloadButton variant="custom" fontFamily={fontFamily} $darkTheme={darkTheme} onClick={saveCode} colors={props.colors}>
                  {window.screen.width >= 768 ? `Save the code` : `Save`}
                </StyledDownloadButton>
              )}
            </Slate>
          </div>
          {showSearch ? <TiTimes className="icon" onClick={() => setShowSearch(false)} /> : <BsSearch className="icon" onClick={() => setShowSearch(true)} />}
          <IoCopy className="icon" onClick={() => copyToClipboard()} />
          <FaShareAlt className="icon" onClick={() => navigate("/discussions/addDiscussion", { state: { code: code.map((node) => Node.string(node)).join("\n")} })} />
        </div>
      </div>
    </TextEditorDiv>
  );
};

export default TextEditor;
