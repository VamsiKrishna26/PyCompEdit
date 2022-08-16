import React, { useEffect, useState } from "react";
import styled from "styled-components";

const InputsDiv = styled.div`
  font-family: ${(props) => props.fontFamily};
  color: ${(props) =>
    props.darkTheme ? props.colors.white : props.colors.black};
  .extras {
    display: flex;
    flex-direction: row;

    .file_name-stdin {
      flex: 0.5;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    .notes {
      flex: 0.5;
      display: flex;
      justify-content: center;
      flex-direction: column;
      /* align-items: center; */
      margin: 0.5em;

      .notes-area {
        flex: 1;
        /* border: 1px solid red; */
        height: 100%;
      }
    }
  }

  .stdin_file-name {
    border-radius: 15px 15px 15px 15px;
    border: ${(props) =>
      props.darkTheme
        ? `1px solid ${props.colors.black}`
        : `1px solid ${props.colors.theme}`};
    padding: 1em;
    background-color: ${(props) =>
      props.darkTheme ? props.colors.dark : props.colors.white};
    font-family: ${(props) => props.fontFamily};
    font-size: ${(props) => props.fontSize};
    font-weight: ${(props) => props.fontWeight};
    color: ${(props) =>
      props.darkTheme ? props.colors.white : props.colors.black};
    margin: 0.5em;
  }

  @media only screen and (max-width: 768px) {
    .extras {
      flex-direction: column;

      .notes {
        margin: 0em;
      }
    }

    .stdin_file-name {
      margin: 0.5em 0em 0.5em 0em;
      padding: 0.5em;
    }
  }
`;

const Inputs = (props) => {
  const {
    fontSize,
    fontFamily,
    darkTheme,
    fontWeight,
    setStdin,
    setFileName,
    setNotes,
    stdin,
    fileName,
    notes,
    readOnly,
  } = props;


  const onStdinChange = (e) => {
    setStdin(e.target.value);
    // localStorage.setItem("stdin", JSON.stringify(e.target.value));
  };

  const onFileNameChange = (e) => {
    // setFileNameInput(e.target.value);
    setFileName(e.target.value);
    // localStorage.setItem("fileName", JSON.stringify(e.target.value));
  };

  const onChangeNotes = (e) => {
    setNotes(e.target.value);
    // localStorage.setItem("notes", JSON.stringify(e.target.value));
  };

  return (
    <InputsDiv
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      darkTheme={darkTheme}
      colors={props.colors}
    >
      <div className="extras">
        <div className="file_name-stdin">
          <label>File Name:</label>
          <input
            // onBlur={()=>setFileName(fileNameInput)}
            onChange={onFileNameChange}
            // onChange={onFileNameChange}
            className="stdin_file-name"
            type="text"
            name="file-name"
            spellCheck="false"
            placeholder="File Name...."
            // defaultValue={fileName}
            readOnly={readOnly}
            value={fileName}
          />
          <label>Input:</label>
          <input
            onChange={onStdinChange}
            className="stdin_file-name"
            type="text"
            name="stdin"
            spellCheck="false"
            placeholder="Input..."
            // defaultValue={stdin}
            readOnly={readOnly}
            value={stdin}
          />
        </div>
        <div className="notes">
          <label>Notes:</label>
          <textarea
            onChange={onChangeNotes}
            className="stdin_file-name notes-area"
            type="text"
            name="notes"
            placeholder="Notes..."
            // defaultValue={notes}
            readOnly={readOnly}
            value={notes}
          />
        </div>
      </div>
    </InputsDiv>
  );
};

export default Inputs;
