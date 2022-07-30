import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddAnswerInput from "./AddAnswerInput";
import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/user/user.selecter";
import { connect } from "react-redux";
import axios from "axios";
import configData from "../../config.json";
import { useNavigate } from "react-router";
import { addAnswer } from "../../redux/user/user.actions";

const AddAnswerDiv = styled.div`
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

    .submit-discussion {
      align-self: flex-end;
    }
  }
`;

const StyledButton = styled(Button)`
  font-family: ${(props) => props.fontFamily};
  color: ${(props) =>
    props.$darkTheme ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkTheme ? props.colors.dark : props.colors.white};
  margin: 0.5em;
  border: ${(props) =>
    props.$darkTheme
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  :hover {
    color: ${(props) =>
      props.$darkTheme ? props.colors.black : props.colors.white};
    background-color: ${(props) =>
      props.$darkTheme ? props.colors.white : props.colors.dark};
    border: ${(props) =>
      props.$darkTheme
        ? `1px solid ${props.colors.theme}`
        : `1px solid ${props.colors.black}`};
  }
`;

const AddAnswer = (props) => {
  const {
    colors,
    font,
    font_sizes,
    $darkThemeHome,
    user,
    discussionId,
    addAnswerAction
  } = props;

  const [answerBody, setAnswerBody] = useState("");

  const navigate = useNavigate();

  const addAnswer = () => {
    axios
      .post(
        configData.PORT + "/addAnswer",
        {
          discussionId:discussionId,
          answerBody: answerBody,
          userId: user.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        addAnswerAction(user, (response.data));
        window.location.reload(false);
      })
      .catch((error) => {
        try {
          console.log(error.response.data.message);
        } catch {
          console.log(error);
          console.log("The server is down. Please try again after some time.");
        }
      });
  };

  return (
    <AddAnswerDiv
      darkTheme={$darkThemeHome}
      fontFamily={font}
      colors={colors}
      font_sizes={font_sizes}
    >
      <div className="title">
        <div className="title-heading">Answer Body:</div>
        <AddAnswerInput {...props} setAnswerBody={setAnswerBody} />
        <div className="submit-discussion">
          <StyledButton
            fontFamily={font}
            $darkTheme={$darkThemeHome}
            colors={colors}
            disabled={
              answerBody === "" ||
              answerBody === "<p></p>\n"
            }
            onClick={addAnswer}
          >
            Submit
          </StyledButton>
        </div>
      </div>
    </AddAnswerDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

const mapDispatchToProps = (dispatch) => ({
  addAnswerAction: (user, object) =>
    dispatch(addAnswer(user, object)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAnswer);
