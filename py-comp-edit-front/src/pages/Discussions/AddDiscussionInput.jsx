import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const AddDiscussionInputDiv = styled.div`
  .editor {
    .demo-wrapper {
      border: 1px solid red;
    }
  }
`;

const AddDiscussionInput = (props) => {
  const [text, setText] = useState(EditorState.createEmpty());

  useEffect(() => {
    console.log(draftToHtml(convertToRaw(text.getCurrentContent())));
  }, [text]);

  return (
    <AddDiscussionInputDiv>
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
