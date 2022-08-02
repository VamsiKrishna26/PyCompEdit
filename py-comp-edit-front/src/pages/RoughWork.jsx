import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import configData from "../config.json";
const RoughWorkDiv = styled.div`
  display: flex;
  flex-direction: column;
  input,
  textarea {
    margin: 1em;
  }
`;

const RoughWork = (props) => {
  const [language, setLanguage] = useState("");

  const [title, setTitle] = useState("");

  const [notes, setNotes] = useState("");

  const [code, setCode] = useState("");

  const addProgram = () => {
    axios
      .post(
        configData.PORT + "/addPrograms",
        {
          language: language,
          program: {
            title: title,
            notes: notes,
            source_code: code,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        try {
          console.log(error.response.data.message);
        } catch {
          console.log(error);
        }
      });
  };

  return (
    <RoughWorkDiv>
      <input onChange={(e) => setLanguage(e.target.value)} />
      <input onChange={(e) => setTitle(e.target.value)} />
      <input onChange={(e) => setNotes(e.target.value)} />
      <textarea onChange={(e) => setCode(e.target.value)} />
      <button onClick={addProgram}>Submit</button>
    </RoughWorkDiv>
  );
};

export default RoughWork;
