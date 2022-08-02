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

const TextEditorDiv = styled.div`
  .text-editor-div {
    display: flex;
    flex-direction: row;
    overflow-y: auto;
    border-radius: 15px 15px 15px 15px;
    border: ${(props) =>
      props.darkTheme
        ? `1px solid ${props.colors.black}`
        : `1px solid ${props.colors.theme}`};
    padding: 1em;
    font-family: ${(props) => props.fontFamily};
    font-size: ${(props) => props.fontSize};
    font-weight: ${(props) => props.fontWeight};
    color: ${(props) =>
      props.darkTheme ? props.colors.white : props.colors.black};
    background-color: ${(props) =>
      props.darkTheme ? props.colors.dark : props.colors.white};
    min-height: 400px !important;
    max-height: 800px !important;
    width: auto;
    position: relative;
    margin-top: 0.5em;
    margin-bottom: 1em;

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

      .text-area {
        border: 1px solid red;
      }
    }
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
  color: ${(props) =>
    props.$darkTheme ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
  margin-left: 0.5em;
  border: ${(props) =>
    props.$darkTheme
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  :hover {
    color: ${(props) =>
      props.$darkTheme ? props.colors.black : props.colors.white};
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.white : props.colors.dark};
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
    submission,
    // language
  } = props;

  const language = props.language || "python";

  // result.stderr='Traceback (most recent call last): File "script.py", line 97, in <module> first_player=prepare_cards() File "script.py", line 67, in prepare_cards shuffled=shuffle_card_deck(cards_deck) File "script.py", line 36, in shuffle_card_deck cards_list1[i]=cards_list2[m] NameError: name "m" is not defined';

  let [editor] = useState(() => withHistory(withReact(createEditor())), []);

  // let [lineNumberError, setLineNumberError] = useState();

  let [timer, setTimer] = useState(Math.floor(new Date().getTime()));

  let [presentTimer, setPresentTimer] = useState(
    Math.floor(new Date().getTime())
  );

  // useEffect(()=>{console.log(timer)},[timer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPresentTimer((presentTimer) => presentTimer + 5000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeDifference(
      Math.abs(Math.floor(presentTimer / 1000) - Math.floor(timer / 1000))
    );
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

  const Leaf = ({ attributes, children, leaf }) => {
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
            ${(leaf.number ||
            leaf.boolean ||
            leaf.tag ||
            leaf.constant ||
            leaf["attr-name"] ||
            leaf.selector) &&
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
        `}
      >
        {children}
      </span>
    );
  };

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
      const ranges = [];
      if (!Text.isText(node)) {
        return ranges;
      }
      const tokens = Prism.tokenize(
        node.text,
        Prism.languages[language.toLowerCase()]
      );
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

      return ranges;
    },
    [language]
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
        if (leading_spaces === 0) {
          var count = 0;
          var index = 0;
          while (prev_node_text.charAt(index++) === "\t") {
            count++;
          }
          leading_spaces = count * 4;
        }
        if (
          (language === "Python" &&
            prev_node_text[prev_node_text.length - 1] === ":") ||
          (language !== "Python" &&
            prev_node_text[prev_node_text.length - 1] === "{")
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
    <TextEditorDiv
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      darkTheme={darkTheme}
      {...props}
    >
      <div className="text-editor-div">
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
              readOnly={submission ? submission.readOnly : false}
            ></Editable>
            {submission && submission.readOnly ? null : (
              <StyledDownloadButton
                variant="custom"
                fontFamily={fontFamily}
                $darkTheme={darkTheme}
                onClick={saveCode}
                colors={props.colors}
              >
                {window.screen.width >= 768 ? `Save the code` : `Save`}
              </StyledDownloadButton>
            )}
          </Slate>
        </div>
      </div>
    </TextEditorDiv>
  );
};

export default TextEditor;
