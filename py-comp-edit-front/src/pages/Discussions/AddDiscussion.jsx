import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddDiscussionInput from "./AddDiscussionInput";
import { createStructuredSelector } from "reselect";
import { selectUser } from "../../redux/user/user.selecter";
import { connect } from "react-redux";
import axios from "axios";
import configData from "../../config.json";
import { useNavigate } from "react-router";
import { addDiscussion } from "../../redux/user/user.actions";

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
      props.$darkTheme ? props.colors.white : props.colors.theme};
    border: ${(props) =>
      props.$darkTheme
        ? `1px solid ${props.colors.theme}`
        : `1px solid ${props.colors.black}`};
  }
`;

const AddDiscussion = (props) => {
  const {
    colors,
    font,
    font_sizes,
    $darkThemeHome,
    user,
    addDiscussionAction,
  } = props;

  const [title, setTitle] = useState("");

  const [discussionBody, setDiscussionBody] = useState("");

  const navigate = useNavigate();

  const addDiscussion = () => {
    axios
      .post(
        configData.PORT + "/addDiscussion",
        {
          title: title,
          discussionBody: discussionBody,
          userId: user.userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        addDiscussionAction(user, (response.data));
        navigate("/discussions/" + response.data);
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
    <AddDiscussionDiv
      darkTheme={$darkThemeHome}
      fontFamily={font}
      colors={colors}
      font_sizes={font_sizes}
    >
      <div className="title">
        <div className="title-heading">Title:</div>
        <input
          onBlur={(e) => setTitle(e.target.value)}
          className="title-input"
          type="text"
          name="title"
          spellCheck="false"
          placeholder="Title..."
          // defaultValue={fileName}
        />
        <div className="title-heading">Discussion Body:</div>
        <AddDiscussionInput {...props} setDiscussionBody={setDiscussionBody} />
        <div className="submit-discussion">
          <StyledButton
            fontFamily={font}
            $darkTheme={$darkThemeHome}
            colors={colors}
            disabled={
              title === "" ||
              discussionBody === "" ||
              discussionBody === "<p></p>\n"
            }
            onClick={addDiscussion}
          >
            Submit
          </StyledButton>
        </div>
      </div>
    </AddDiscussionDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

const mapDispatchToProps = (dispatch) => ({
  addDiscussionAction: (user, discussionId) =>
    dispatch(addDiscussion(user, discussionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddDiscussion);
