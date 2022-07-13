import React from "react";
import styled from "styled-components";

const DisplayResultDiv = styled.div`
  .display-result-div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-family: ${(props) => props.fontFamily};
    font-size: ${(props) => props.fontSize};
    font-weight: ${(props) => props.fontWeight};
    color: ${(props) => (props.darkTheme ? props.colors.white : props.colors.black)};
    .json-key {
      color: ${(props) => (props.darkTheme ? "#de2758" : "#296c99")};
    }
  }
`;

const DisplayResult = (props) => {
  const { fontFamily, fontSize, darkTheme,result,fontWeight } = props;

  return (
    <DisplayResultDiv
      fontFamily={fontFamily}
      fontSize={fontSize}
      darkTheme={darkTheme}
      fontWeight={fontWeight}
      colors={props.colors}
    >
      <div className="display-result-div">
        <p>
          <span className="json-key">Input: </span>
          {result.stdin&&result.stdin !== "" ? result.stdin : "<No input>"}
        </p>
        <p>
          <span className="json-key">Output: </span><br/>
          <span style={{whiteSpace: "pre-line"}}>{result.stdout&&result.stdout !== "" ? result.stdout : "<No output>"}</span>
        </p>
        {
            result.stderr?
            <p><span className="json-key">Error: </span>{result.stderr}</p>:null
        }
        {
            result.message?
            <p><span className="json-key">Message: </span>{result.message}</p>:null
        }
        {
            result.memory?
            <p><span className="json-key">Memory Used: </span>{result.memory} KB</p>:null
        }
        {
            result.time?
            <p><span className="json-key">Time taken: </span>{result.time} seconds</p>:null
        }
      </div>
    </DisplayResultDiv>
  );
};

export default DisplayResult;
