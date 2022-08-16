import React from "react";
import styled from "styled-components";
import img from "../../assets/run-button-bg.png";
const RunButtonDiv = styled.div`
  .run-button-div {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .run-button {
      position: relative;
      width: 140px;
      height: 40px;
      margin: 0.5em;
      margin-right: 2em;
      line-height: 40px;
      letter-spacing: 2px;
      text-decoration: none;
      text-transform: uppercase;
      text-align: center;
      color: ${(props) => (props.darkTheme ? "white" : "black")};
      font-family: ${(props) => props.fontFamily};
      background-color: ${(props) =>
        props.darkTheme ? "rgb(44,44,44)" : "white"};
      transition: 0.5s;
      border: 1px solid #49be25;
      border-radius: 15px 15px 15px 15px;
      cursor: pointer;
      &:hover {
        border: 1px solid transparent;
        background: #49be25 url(${img}); // 360px x 1080px
        transition-delay: 0.5s;
        background-size: 180px;
        animation: animate 0.5s steps(5) forwards;
      }
    }
    @keyframes animate {
      0% {
        background-position-y: 0;
      }
      100% {
        background-position-y: -480px;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .run-button {
      margin-right: 0.5em !important;
    }
  }
`;

const RunButton = (props) => {
  const { fontFamily, fontSize, darkTheme, fetchSubmission } = props;

  return (
    <RunButtonDiv
      fontFamily={fontFamily}
      fontSize={fontSize}
      darkTheme={darkTheme}
    >
      <div className="run-button-div">
        <button onClick={fetchSubmission} className="run-button">
          Run
        </button>
      </div>
    </RunButtonDiv>
  );
};

export default RunButton;
