import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import styled from "styled-components";
import configData from "../../config.json";

const SubmissionDiv = styled.tr`
  .more {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

const StyledModal = styled(Modal)`
  .delete {
    border: 1px solid red;
  }
`;

const StyledModalHeader = styled(Modal.Header)`
  border: ${(props) => (props.$darkThemeHome ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.white)};
`;

const StyledModalTitle = styled(Modal.Title)`
  font-family: ${(props) => props.font} !important;
  color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.black)};
`;

const StyledModalBody = styled(Modal.Body)`
  border: ${(props) => (props.$darkThemeHome ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.white)};
  font-family: ${(props) => props.font} !important;
  color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.black)};

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
  color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.black)};
  background-color: ${(props) => (props.$darkThemeHome ? props.colors.dark : props.colors.white)};
  margin-left: 0.5em;
  border: ${(props) => (props.$darkThemeHome ? `1px solid ${props.colors.black}` : `1px solid ${props.colors.theme}`)};
  :hover {
    color: ${(props) => (props.$darkThemeHome ? props.colors.black : props.colors.white)};
    background-color: ${(props) => (props.$darkThemeHome ? props.colors.white : props.colors.theme)};
    border: ${(props) => (props.$darkThemeHome ? `1px solid ${props.colors.theme}` : "")};
  }
`;

const MoreModal = ({ onHide, dispatch, noOfDocuments, ...props }) => {
  const navigate = useNavigate();

  const showCode = () => {
    navigate("/editor", {
      state: {
        ...props.submission,
        readOnly: true,
        language: props.submission.language.name,
      },
    });
  };

  const editCode = () => {
    navigate("/editor", {
      state: {
        ...props.submission,
        readOnly: false,
        language: props.submission.language.name,
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
        <StyledModalTitle {...props}>{props.submission.fileName}</StyledModalTitle>
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
            <span style={{ color: "green" }}>{props.submission.status.description}</span>
          ) : (
            <span style={{ color: "red" }}>{props.submission.status.description}</span>
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
        <StyledDownloadButton className="delete" {...props} onClick={() => deleteSubmission(props.submission._id)}>
          Delete
        </StyledDownloadButton>
      </StyledModalBody>
    </StyledModal>
  );
};

const Submission = (props) => {
  const { submission, index, page, noOfDocuments } = props;

  const [showMoreModal, setShowMoreModal] = useState(false);

  return (
    <SubmissionDiv>
      <td>{(page - 1) * noOfDocuments + index + 1}</td>
      <td>{submission.fileName}</td>
      <td>{submission.language.name}</td>
      <td>{moment(submission.finished_at).calendar()}</td>
      <td>
        {submission.status.description === "Accepted" ? (
          <span style={{ color: "green" }}>{submission.status.description}</span>
        ) : (
          <span style={{ color: "red" }}>{submission.status.description}</span>
        )}
      </td>
      <td className="more" onClick={() => setShowMoreModal(true)}>
        ...
      </td>
      <MoreModal show={showMoreModal ? 1 : 0} onHide={() => setShowMoreModal(false)} {...props} />
    </SubmissionDiv>
  );
};

export default Submission;
