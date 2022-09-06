import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EditorState, ContentState, convertToRaw, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { useLocation } from "react-router";

const AddDiscussionInputDiv = styled.div`
  .editor {
    margin: 0.5em;
    .demo-wrapper {
      font-family: ${(props) => props.fontFamily};
      color: ${(props) => props.colors.black};
      border: ${(props) => (props.darkTheme ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
      background-color: ${(props) => props.colors.white};
      border-radius: 15px 15px 15px 15px;
      padding: 1em;
    }
  }
`;

const AddDiscussionInput = (props) => {
  const location = useLocation();

  const [locState, setLocState] = useState(null);

  useEffect(() => {
    setLocState(location.state&&location.state.code ? location.state.code : null);
  }, [location]);

  const [text, setText] = useState(EditorState.createEmpty());

  const { colors, font, font_sizes, $darkThemeHome, setDiscussionBody } = props;

  useEffect(() => {
    if (locState) {
      const blocksOfHtml=convertFromHTML(`<pre><code>${locState}</pre></code>`);
      const content = ContentState.createFromBlockArray(
        blocksOfHtml.contentBlocks,
        blocksOfHtml.entityMap
      );
      console.log(content);
      setText(EditorState.createWithContent(content));
    }
  }, [locState]);

  useEffect(() => {
    setDiscussionBody(draftToHtml(convertToRaw(text.getCurrentContent())).replace(/<br>/g, "\n"), "text/html");
  }, [text]);

  return (
    <AddDiscussionInputDiv darkTheme={$darkThemeHome} fontFamily={font} colors={colors} font_sizes={font_sizes}>
      <div className="editor">
        <Editor
          editorState={text}
          onEditorStateChange={(text) => setText(text)}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          spellCheck="false"
        />
      </div>
    </AddDiscussionInputDiv>
  );
};

export default AddDiscussionInput;
