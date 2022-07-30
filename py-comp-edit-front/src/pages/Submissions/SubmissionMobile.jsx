import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import styled from "styled-components";
import configData from "../../config.json";
import {
  BsFillFileEarmarkFill,
  BsFileCodeFill,
  BsFillCalendarDateFill,
} from "react-icons/bs";
import { TiTick, TiTimes } from "react-icons/ti";
import { FiMoreHorizontal } from "react-icons/fi";

const SubmissionMobileDiv = styled.div`
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

  .icon {
    color: ${(props) =>
      props.$darkThemeHome ? props.colors.white : props.colors.theme};
    margin: 0.3em;
  }

  .more{
    align-self: flex-end;
  }
`;

const StyledModal = styled(Modal)`
  .delete {
    border: 1px solid red;
  }
`;

const StyledModalHeader = styled(Modal.Header)`
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
`;

const StyledModalTitle = styled(Modal.Title)`
  font-family: ${(props) => props.font} !important;
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};
`;

const StyledModalBody = styled(Modal.Body)`
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
  font-family: ${(props) => props.font} !important;
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};

  .nav-tabs {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .tab-content {
    background-color: white;
  }
`;

const StyledDownloadButton = styled(Button)`
  font-family: ${(props) => props.fontFamily};
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
  margin-left: 0.5em;
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  :hover {
    color: ${(props) =>
      props.$darkThemeHome ? props.colors.black : props.colors.white};
    background-color: ${(props) =>
      props.$darkThemeHome ? props.colors.white : props.colors.dark};
    border: ${(props) =>
      props.$darkThemeHome ? `1px solid ${props.colors.theme}` : ""};
  }
`;

const language_dict = {
  "Python (3.8.1)": "Python",
  "Java (OpenJDK 13.0.1)": "Java",
  "JavaScript (Node.js 12.14.0)": "JavaScript",
  "C# (Mono 6.6.0.161)": "CSharp",
  "C++ (Clang 7.0.1)": "Cpp",
  "C (GCC 7.4.0)": "C",
};

const MoreModal = ({ onHide, dispatch, noOfDocuments, ...props }) => {
  const navigate = useNavigate();

  const showCode = () => {
    navigate("/editor", {
      state: {
        ...props.submission,
        readOnly: true,
        language: language_dict[props.submission.language.name],
      },
    });
  };

  const editCode = () => {
    navigate("/editor", {
      state: {
        ...props.submission,
        readOnly: false,
        language: language_dict[props.submission.language.name],
      },
    });
  };

  const deleteSubmission = (_id) => {
    axios
      .post(
        configData.PORT + "/deleteSubmission",
        {
          submissionId: _id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <StyledModal {...props} onHide={onHide} centered>
      <StyledModalHeader {...props} closeButton>
        <StyledModalTitle {...props}>
          {props.submission.fileName}
        </StyledModalTitle>
      </StyledModalHeader>
      <StyledModalBody {...props}>
        <p>
          <span style={{ fontWeight: "bold" }}>Language: </span>
          {props.submission.language.name}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Last Submission: </span>
          {moment(props.submission.finished_at).calendar()}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Status: </span>
          {props.submission.status.description === "Accepted" ? (
            <span style={{ color: "green" }}>
              {props.submission.status.description}
            </span>
          ) : (
            <span style={{ color: "red" }}>
              {props.submission.status.description}
            </span>
          )}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Notes: </span>
          {props.submission.notes === "" ? "<No Text>" : props.submission.notes}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Time taken: </span>
          {props.submission.time ? props.submission.time : 0} seconds
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Memory: </span>
          {props.submission.memory ? props.submission.memory : 0} KB
        </p>
        <StyledDownloadButton {...props} onClick={showCode}>
          Show
        </StyledDownloadButton>
        <StyledDownloadButton {...props} onClick={editCode}>
          Edit
        </StyledDownloadButton>
        <StyledDownloadButton
          className="delete"
          {...props}
          onClick={() => deleteSubmission(props.submission._id)}
        >
          Delete
        </StyledDownloadButton>
      </StyledModalBody>
    </StyledModal>
  );
};

const SubmissionMobile = (props) => {
  const { submission } = props;

  const [showMoreModal, setShowMoreModal] = useState(false);

  return (
    <SubmissionMobileDiv
      $darkThemeHome={props.$darkThemeHome}
      colors={props.colors}
      font={props.font}
    >
      <div>
        <BsFillFileEarmarkFill className="icon" />
        {submission.fileName}
      </div>
      <div>
        <BsFileCodeFill className="icon" />
        {submission.language.name}
      </div>
      <div>
        <BsFillCalendarDateFill className="icon" />
        {moment(submission.finished_at).calendar()}
      </div>
      <div>
        {submission.status.description === "Accepted" ? (
          <span style={{ color: "green" }}>
            <TiTick className="icon" style={{ color: "green" }}/>
            {submission.status.description}
          </span>
        ) : (
          <span style={{ color: "red" }}>
            <TiTimes className="icon" style={{ color: "red" }}/>
            {submission.status.description}
          </span>
        )}
      </div>
      <div className="more" onClick={() => setShowMoreModal(true)}>
        More <FiMoreHorizontal className="icon"/>
      </div>
      <MoreModal
        show={showMoreModal ? 1 : 0}
        onHide={() => setShowMoreModal(false)}
        {...props}
      />
    </SubmissionMobileDiv>
  );
};

export default SubmissionMobile;
