import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import configData from "../../config.json";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import SortBar from "./SortBar";
import PaginationComp from "./Pagination";
import Discussion from "./Discussion";

const DiscussionsDiv = styled.div`
  margin: 1em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .discussion {
  }

  .documents {
    margin: 1em;
    align-self: flex-end;
  }
  .pagination {
    margin: 1em;
    align-self: center;
  }
`;
const StyledDropDownToggle = styled(Dropdown.Toggle)`
  font-family: ${(props) => props.font};
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
  border: ${(props) =>
    props.$darkThemeHome
      ? `1px solid ${props.colors.black}`
      : `1px solid ${props.colors.theme}`};
  :focus {
    font-family: ${(props) => props.font} !important;
    color: ${(props) =>
      props.$darkThemeHome
        ? props.colors.white
        : props.colors.black} !important;
    background-color: ${(props) =>
      props.$darkThemeHome ? props.colors.dark : props.colors.white} !important;
  }
  :hover {
    color: ${(props) =>
      props.$darkThemeHome ? props.colors.black : props.colors.white};
    background-color: ${(props) =>
      props.$darkThemeHome ? props.colors.white : props.colors.dark};
  }
`;

const StyledDropDownMenu = styled(Dropdown.Menu)`
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
`;
const StyledDropDownItem = styled(Dropdown.Item)`
  font-family: ${(props) => props.font};
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
`;

const Discussions = (props) => {
  const [sort, setSort] = useState({ finished_at: -1 });

  const [page, setPage] = useState(1);

  const [noOfDocuments, setNoOfDocuments] = useState(10);

  const [discussions, setDiscussions] = useState([]);

  const [key, setKey] = useState("Last Created");

  const [pages, setPages] = useState(1);

  const navigate = useNavigate();

  const { colors, font, font_sizes, $darkThemeHome } = props;

  useEffect(() => {
    console.log(discussions);
  }, [discussions]);

  useEffect(() => {
    console.log(sort, page, noOfDocuments);
    axios
      .post(
        configData.PORT + "/discussions",
        {
          sort: sort,
          page: page,
          noOfDocuments: noOfDocuments,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => setDiscussions(response.data))
      .catch((error) => {
        try {
          console.log(error.response.data.message);
        } catch {
          console.log(error);
          console.log("The server is down. Please try again after some time.");
        }
      });
  }, [sort, page, noOfDocuments]);

  useEffect(() => {
    axios
      .post(
        configData.PORT + "/pages1",
        {
          noOfDocuments: noOfDocuments,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => setPages(response.data))
      .catch((error) => {
        try {
          console.log(error.response.data.message);
        } catch {
          console.log("The server is down. Please try again after some time.");
        }
      });
    setPage(1);
  }, [noOfDocuments]);

  const documents = [10, 25, 50, 75, 100];

  const documents_list = (props) => {
    let documentsList = [];
    for (var i = 0; i < documents.length; i++) {
      documentsList.push(
        <StyledDropDownItem
          $darkThemeHome={props.$darkThemeHome}
          eventKey={documents[i]}
          key={documents[i]}
          colors={props.colors}
          font={font}
        >
          {documents[i]}
        </StyledDropDownItem>
      );
    }
    return documentsList;
  };

  return (
    <DiscussionsDiv
      colors={colors}
      font={font}
      font_sizes={font_sizes}
      $darkThemeHome={$darkThemeHome}
    >
      <div className="sort-bar">
        <SortBar
          keyprop={key}
          setKey={setKey}
          sort={sort}
          setSort={setSort}
          {...props}
        />
      </div>
      <div className="discussion">
        {discussions.map((item, i) => (
          <Discussion
            key={i}
            index={i}
            discussion={item}
            colors={colors}
            font={font}
            font_sizes={font_sizes}
            $darkThemeHome={$darkThemeHome}
            page={page}
            noOfDocuments={noOfDocuments}
            {...props}
          ></Discussion>
        ))}
      </div>
      <div className="pagination">
        <PaginationComp
          page={page}
          pages={pages}
          setPage={setPage}
          {...props}
        />
      </div>
      <div className="documents">
        <Dropdown
          variant="custom"
          onSelect={(noOfDocuments) => {
            if (noOfDocuments) setNoOfDocuments(parseInt(noOfDocuments));
          }}
          className="dropdown"
        >
          <StyledDropDownToggle
            $darkThemeHome={$darkThemeHome}
            colors={colors}
            font={font}
          >
            {window.screen.width >= 768
              ? `Number of Documents: ${noOfDocuments}`
              : `${noOfDocuments}`}
          </StyledDropDownToggle>

          <StyledDropDownMenu $darkThemeHome={$darkThemeHome} colors={colors}>
            {documents_list({ ...props })}
          </StyledDropDownMenu>
        </Dropdown>
      </div>
    </DiscussionsDiv>
  );
};

export default Discussions;
