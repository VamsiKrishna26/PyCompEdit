import React from "react";
import styled from "styled-components";

const AddDiscussionDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-family: ${(props) => props.fontFamily};
  color: ${(props) =>
    props.darkTheme ? props.colors.white : props.colors.black};
  padding: 1em;

  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    .title-heading {
      font-size: ${(props) => props.font_sizes.heading3};
    }

    .title-input {
      border-radius: 15px 15px 15px 15px;
      border: ${(props) =>
        props.darkTheme
          ? `1px solid ${props.colors.black}`
          : `1px solid ${props.colors.theme}`};
      padding: 1em;
      background-color: ${(props) =>
        props.darkTheme ? props.colors.dark : props.colors.white};
      margin: 0.5em;
    }
  }
`;

const AddDiscussion = (props) => {
  const { colors, font, font_sizes, $darkThemeHome } = props;

  return (
    <AddDiscussionDiv
      darkTheme={$darkThemeHome}
      fontFamily={font}
      colors={colors}
      font_sizes={font_sizes}
    >
      <div className="title">
        <div className="title-heading">Title</div>
        <input
          // onBlur={onFileNameChange}
          className="title-input"
          type="text"
          name="title"
          spellCheck="false"
          placeholder="Title..."
          // defaultValue={fileName}
        />
      </div>
    </AddDiscussionDiv>
  );
};

export default AddDiscussion;
