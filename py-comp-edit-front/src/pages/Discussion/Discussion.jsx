import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import axios from "axios";
import configData from "../../config.json";
import { FaUserCircle, FaFireAlt } from "react-icons/fa";
import {
  BsCalendarDateFill,
  BsEmojiSmileFill,
  BsEmojiFrownFill,
  BsEmojiSmile,
  BsEmojiFrown,
} from "react-icons/bs";
import moment from "moment";
import DiscussionBody from "./DiscussionBody";
import Answer from "./Answer";
import { Accordion, Dropdown } from "react-bootstrap";
import AddAnswer from "./AddAnswer";
import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/user/user.selecter";
import { connect } from "react-redux";

const DiscussionDiv = styled.div`
  display: flex;
  flex-direction: column;
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
  padding: 1em;

  .discussion {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      align-self: center;
      font-size: ${(props) => props.font_sizes.heading3};
    }

    .side-titles {
      margin-top: 0.8em;
    }
  }

  .titles {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .title-heading {
      font-weight: bold;
      margin-right: 0.3em;
    }
  }

  .details {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .side-titles {
      flex: 0.7;
    }

    .scores {
      flex: 0.3;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      font-size: ${(props) => props.font_sizes.heading3};

      .icon {
        margin-top: 0.3em;
        margin-bottom: 0.3em;
        cursor: pointer;
      }
    }
  }

  .icon {
    color: ${(props) =>
      props.$darkThemeHome ? props.colors.white : props.colors.theme};
    margin-left: 0.3em;
  }

  .answer-sorts {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .add-answer {
    margin: 0.5em;
  }

  .accordion {
    font-family: ${(props) => props.font};

    .accordion-body {
      /* border: 1px solid red; */
      background-color: ${(props) =>
        props.$darkThemeHome ? props.colors.dark : props.colors.white} !important;
      color: ${(props) =>
        props.$darkThemeHome ? props.colors.white : props.colors.black} !important;
      border-color: ${(props) =>
        props.$darkThemeHome
          ? `${props.colors.black}`
          : `${props.colors.theme}`} !important;
    }
    .accordion-button {
      color: ${(props) =>
        props.$darkThemeHome
          ? `${props.colors.white}`
          : `${props.colors.black}`} !important;
      background-color: ${(props) =>
        props.$darkThemeHome ? props.colors.dark : props.colors.white} !important;
      :not(.collapsed) {
        background-color: ${(props) =>
          props.$darkThemeHome ? props.colors.white : props.colors.theme} !important;
        color: ${(props) =>
        props.$darkThemeHome
          ? `${props.colors.black}`
          : `${props.colors.white}`} !important;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    padding: 0.5em;
    .add-answer{
      margin: 0em 0em 0.5em 0em;
    }
    .accordion {
      .accordion-body{
        padding: 0.3em !important;
      }
    }
  }
`;

const StyledDropDownToggle = styled(Dropdown.Toggle)`
  font-family: ${(props) => props.font};
  color: ${(props) =>
    props.$darkTheme ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
  border: ${(props) =>
    props.$darkTheme
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  :focus {
    font-family: ${(props) => props.font} !important;
    color: ${(props) =>
      props.$darkTheme ? props.colors.white : props.colors.black} !important;
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.dark : props.colors.white} !important;
  }
  :hover {
    color: ${(props) =>
      props.$darkTheme ? props.colors.black : props.colors.white};
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.white : props.colors.theme};
  }
  margin-bottom: 0.5em;
`;

const StyledDropDownMenu = styled(Dropdown.Menu)`
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
`;

const StyledDropDownItem = styled(Dropdown.Item)`
  font-family: ${(props) => props.font};
  color: ${(props) =>
    props.$darkTheme ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
`;

const StyledAccordion = styled(Accordion)``;

const StyledAccordionItem = styled(Accordion.Item)``;

const StyledAccordionHeader = styled(Accordion.Header)``;

const StyledAccordionBody = styled(Accordion.Body)``;

const Discussion = (props) => {

  const [discussion, setDiscussion] = useState(null);

  const [answers, setAnswers] = useState([]);

  const { discussionId } = useParams();

  const sorts_list = ["Default", "Highest Scored", "Date Desc", "Date Asc"];

  const [sort, setSort] = useState("Default");

  useEffect(()=>{
    document.title=`${discussion?discussion.Title:`Doesn't exist`} - PyCompEdit`;
  },[discussion])

  const { user } = props;

  const [scoreStatus, setScoreStatus] = useState({
    score: null,
    smileActive: false,
    frownActive: false,
  });

  useEffect(() => {
    if (discussion) setAnswers(discussion.Answers);
  }, [discussion]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (discussion)
      setScoreStatus((prevState) => ({
        ...prevState,
        score: discussion.Score,
      }));
  }, [discussion]);

  useEffect(() => {
    if (sort === "Default") {
      setAnswers([].concat(answers).sort((a, b) => (a._id > b._id ? 1 : -1)));
    } else if (sort === "Highest Scored") {
      setAnswers(
        [].concat(answers).sort((a, b) => (a.Score > b.Score ? -1 : 1))
      );
    } else if (sort === "Date Desc") {
      setAnswers(
        []
          .concat(answers)
          .sort((a, b) => (a.CreationDate > b.CreationDate ? -1 : 1))
      );
    } else if (sort === "Date Asc") {
      setAnswers(
        []
          .concat(answers)
          .sort((a, b) => (a.CreationDate > b.CreationDate ? 1 : -1))
      );
    }
  }, [sort]);

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

  const sorts_jsx = (props) => {
    let sorts = [];
    for (var key in sorts_list) {
      sorts.push(
        <StyledDropDownItem
          fontFamily={props.font}
          $darkTheme={props.$darkThemeHome}
          eventKey={sorts_list[key]}
          key={key}
          colors={props.colors}
        >
          {sorts_list[key]}
        </StyledDropDownItem>
      );
    }
    return sorts;
  };

  useEffect(() => {
    axios
      .get(
        configData.PORT + "/getDiscussionById",
        { params: { discussionId: discussionId } },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => setDiscussion(response.data))
      .catch((error) => {
        try {
          console.log(error.response.data.message);
        } catch {
          console.log(error);
          console.log("The server is down. Please try again after some time.");
        }
      });
  }, [discussionId]);

  return (
    <DiscussionDiv
      $darkThemeHome={props.$darkThemeHome}
      colors={props.colors}
      font={props.font}
      font_sizes={props.font_sizes}
    >
      {discussion ? (
        <div className="discussion">
          <div className="title">{discussion.Title}</div>
          <div className="details">
            <div className="side-titles">
              <p className="titles">
                <span className="title-heading">Discussion Id: </span>
                {discussion.Id}
              </p>
              <p className="titles">
                <span className="title-heading">Creation Date: </span>
                {moment(discussion.CreationDate).calendar()}
                <BsCalendarDateFill className="icon" />
              </p>
              <p className="titles">
                <span className="title-heading">UserId: </span>
                {discussion.userId}
                <FaUserCircle className="icon" />
              </p>
              <p className="titles">
                <span className="title-heading">Views: </span>
                {discussion.Views}
                <FaFireAlt className="icon" />
              </p>
            </div>
            <div className="scores">
              {!scoreStatus.smileActive ? (
                <BsEmojiSmile className="icon" onClick={handleSmile} />
              ) : (
                <BsEmojiSmileFill className="icon" onClick={handleSmile} />
              )}
              {scoreStatus.score || scoreStatus.score === 0
                ? scoreStatus.score
                : null}
              {!scoreStatus.frownActive ? (
                <BsEmojiFrown className="icon" onClick={handleFrown} />
              ) : (
                <BsEmojiFrownFill className="icon" onClick={handleFrown} />
              )}
            </div>
          </div>
          <div className="discussion-body">
            <p className="titles">
              <span className="title-heading">Question: </span>
            </p>
            <DiscussionBody {...props} discussionBody={discussion.Body} />
          </div>
          <div className="Answers">
            <div className="answer-sorts">
              <p className="titles">
                <span className="title-heading">
                  Answers ({answers.length}):{" "}
                </span>
              </p>
              <Dropdown
                variant="custom"
                onSelect={(sort) => setSort(sort)}
                className="dropdown"
              >
                <StyledDropDownToggle
                  font={props.font}
                  $darkTheme={props.$darkThemeHome}
                  colors={props.colors}
                >
                  {window.screen.width >= 768
                    ? `Sort Order: ${sort}`
                    : `${sort}`}
                </StyledDropDownToggle>

                <StyledDropDownMenu
                  $darkTheme={props.$darkThemeHome}
                  colors={props.colors}
                >
                  {sorts_jsx({ ...props })}
                </StyledDropDownMenu>
              </Dropdown>
            </div>
            {user ? (
              <StyledAccordion
                font={props.font}
                $darkTheme={props.$darkThemeHome}
                colors={props.colors}
                className="add-answer"
              >
                <StyledAccordionItem
                  font={props.font}
                  $darkTheme={props.$darkThemeHome}
                  colors={props.colors}
                  eventKey="0"
                >
                  <StyledAccordionHeader
                    font={props.font}
                    $darkTheme={props.$darkThemeHome}
                    colors={props.colors}
                  >
                    Add Answer
                  </StyledAccordionHeader>
                  <StyledAccordionBody
                    font={props.font}
                    $darkTheme={props.$darkThemeHome}
                    colors={props.colors}
                  >
                    <AddAnswer discussionId={discussion.Id} {...props} />
                  </StyledAccordionBody>
                </StyledAccordionItem>
              </StyledAccordion>
            ) : null}
            {answers.map((answer, index) => (
              <Answer discussionId={discussion.Id} {...props} key={index} answer={answer} />
            ))}
          </div>
        </div>
      ) : (
        <p>Discussion not found</p>
      )}
    </DiscussionDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(Discussion);
