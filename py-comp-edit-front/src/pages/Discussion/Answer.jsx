import React, { useEffect, useState } from "react";
import styled from "styled-components";
import parse, { domToReact } from "html-react-parser";
import Prism from "prismjs";
import { FaUserCircle, FaFireAlt } from "react-icons/fa";
import {
  BsCalendarDateFill,
  BsEmojiSmileFill,
  BsEmojiFrownFill,
  BsEmojiSmile,
  BsEmojiFrown,
} from "react-icons/bs";
import moment from "moment";
import { AiFillEdit } from "react-icons/ai";
import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/user/user.selecter";
import { connect } from "react-redux";

const AnswerDiv = styled.div`
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  margin-bottom: 0.5em;
  padding: 0.5em;
  border-radius: 15px 15px 15px 15px;

  .body-answer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: auto;

    .pre {
      align-self: center;
      border: ${(props) =>
        props.$darkThemeHome
          ? `1px solid ${props.colors.black}`
          : `1px solid ${props.colors.theme}`};
      border-radius: 15px 15px 15px 15px;
      padding: 1em;
      margin: auto;
      margin-bottom: 0.5em;
    }
  }

  .details {
    display: flex;
    justify-content: space-around !important;
    align-items: center;
    margin-bottom: 0.5em;
  }

  .icon {
    color: ${(props) =>
      props.$darkThemeHome ? props.colors.white : props.colors.theme};
  }

  .icon-score {
    cursor: pointer;
    margin: 0.3em !important;
  }

  p {
    margin: 0.3em !important;
  }

  @media only screen and (max-width: 768px) {
    padding: 0em;
  }
`;

const Answer = (props) => {
  const { answer, discussionId, user } = props;

  // console.log(Object.keys(user.answers),discussionId)

  const [scoreStatus, setScoreStatus] = useState({
    score: null,
    smileActive: false,
    frownActive: false,
  });

  useEffect(() => {
    if (answer)
      setScoreStatus((prevState) => ({ ...prevState, score: answer.Score }));
  }, [answer]);

  const setSmile = () => {
    setScoreStatus((prevState) => ({
      ...prevState,
      smileActive: !scoreStatus.smileActive,
      score: scoreStatus.smileActive
        ? scoreStatus.score - 1
        : scoreStatus.score + 1,
    }));
  };

  const setFrown = () => {
    setScoreStatus((prevState) => ({
      ...prevState,
      frownActive: !scoreStatus.frownActive,
      score: scoreStatus.frownActive
        ? scoreStatus.score + 1
        : scoreStatus.score - 1,
    }));
  };

  const handleSmile = () => {
    if (scoreStatus.frownActive) {
      setSmile();
      setFrown();
    }
    setSmile();
  };

  const handleFrown = () => {
    if (scoreStatus.smileActive) {
      setFrown();
      setSmile();
    }
    setFrown();
  };

  useEffect(() => {
    props.$darkThemeHome
      ? require("prismjs/themes/prism-tomorrow.css")
      : require("prismjs/themes/prism-solarizedlight.css");
    Prism.highlightAll();
  }, [answer]);

  const options = {
    replace: (domNode) => {
      if (domNode.name === "pre") {
        return (
          <pre className="pre">{domToReact(domNode.children, options)}</pre>
        );
      } else if (domNode.name === "code") {
        return (
          <code className="language-python">
            {domToReact(domNode.children, options)}
          </code>
        );
      }
    },
  };

  return (
    <AnswerDiv
      $darkThemeHome={props.$darkThemeHome}
      colors={props.colors}
      font={props.font}
      font_sizes={props.font_sizes}
      className="answer"
    >
      <div className="answer-body">
        <div className="details">
          <span className="children">
            <FaUserCircle className="icon" /> {answer.userId}
          </span>
          <span className="children">
            <BsCalendarDateFill className="icon" />{" "}
            {moment(answer.CreationDate).calendar()}
          </span>
          <span className="children">
            {!scoreStatus.smileActive ? (
              <BsEmojiSmile className="icon icon-score" onClick={handleSmile} />
            ) : (
              <BsEmojiSmileFill
                className="icon icon-score"
                onClick={handleSmile}
              />
            )}
            {scoreStatus.score || scoreStatus.score === 0
              ? scoreStatus.score
              : null}
            {!scoreStatus.frownActive ? (
              <BsEmojiFrown className="icon icon-score" onClick={handleFrown} />
            ) : (
              <BsEmojiFrownFill
                className="icon icon-score"
                onClick={handleFrown}
              />
            )}
          </span>
          {user &&
          user.answers.includes(String(discussionId)+'_'+String(answer.Id)) ? (
            <span className="children">
              <AiFillEdit className="icon" style={{cursor:'pointer'}}/>
            </span>
          ) : null}
        </div>
        {parse(`<div className="body-answer">${answer.Body}</div>`, options)}
      </div>
    </AnswerDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(Answer);
