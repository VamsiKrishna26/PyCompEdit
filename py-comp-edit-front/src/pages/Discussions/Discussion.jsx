import React from "react";
import styled from "styled-components";
import moment from "moment";
import { FaUserCircle, FaFireAlt } from "react-icons/fa";
import {
  BsCalendarDateFill,
  BsEmojiSmileFill,
  BsEmojiFrownFill,
} from "react-icons/bs";

import { useNavigate } from "react-router-dom";

const DiscussionDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 60px;
  margin-top: 1em;
  margin-bottom: 1em;
  justify-content: center;
  font-family: ${(props) => props.font};
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  border-radius: 15px 15px 15px 15px;
  padding: 0.7em;
  cursor: pointer;

  .icon {
    color: ${(props) =>
      props.$darkThemeHome ? props.colors.white : props.colors.theme};
      margin: 0.3em;
  }

  .top-row {
    position: relative;
    width: auto;
    display: flex;
    align-items: center;
    margin-bottom: 0.3em;

    .children1 {
      flex: 0.2;
    }
    .children2 {
      flex: 0.8;
    }
  }
  .bottom-row {
    position: relative;
    width: auto;
    display: flex;
    align-items: center;

    .children1 {
      flex: 0.33;
    }
    .children2 {
      flex: 0.33;
    }
    .children3 {
      flex: 0.33;
    }
  }
`;

const Discussion = (props) => {
  const { discussion } = props;

  const navigate=useNavigate();

  const goToDiscussion=(_id)=>{
    console.log("Hello")
    navigate(`/discussions/${_id}`);
  }

  return (
    <DiscussionDiv
      $darkThemeHome={props.$darkThemeHome}
      colors={props.colors}
      font={props.font}
      onClick={()=>goToDiscussion(discussion._id)}
    >
      <div className="top-row">
        <span className="children1">
          <FaUserCircle className="icon" />{" "}{discussion.userId}
        </span>
        <span className="children2">{discussion.Title}</span>
      </div>
      <div className="bottom-row">
        <span className="children1">
          <BsCalendarDateFill className="icon" />{" "}
          {moment(discussion.CreationDate).calendar()}
        </span>
        <span className="children2">
          <BsEmojiSmileFill className="icon" />{" "}{discussion.Score}{" "}
          <BsEmojiFrownFill className="icon" />
        </span>
        <span className="children3">
          <FaFireAlt className="icon" />{" "}{discussion.Views}
        </span>
      </div>
    </DiscussionDiv>
  );
};

export default Discussion;
