import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import configData from "../../config.json";
import { Button, Dropdown } from "react-bootstrap";
import SortBar from "./SortBar";
import PaginationComp from "./Pagination";
import Discussion from "./Discussion";
import { useNavigate } from "react-router-dom";
import { BsSearch, BsFillEraserFill } from "react-icons/bs";

const DiscussionsDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .discussion {
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 700px;

    .search {
      flex: 0.8;
      border-radius: 15px 15px 15px 15px;
      border: ${(props) =>
        props.$darkThemeHome
          ? `1px solid ${props.colors.black}`
          : `1px solid ${props.colors.theme}`};
      padding: 1em;
      background-color: ${(props) =>
        props.$darkThemeHome ? props.colors.dark : props.colors.white};
      font-family: ${(props) => props.font};
      color: ${(props) =>
        props.$darkThemeHome ? props.colors.white : props.colors.black};
      margin-top: 0.5em;
    }
    .icon {
      flex: 0.1;
      color: ${(props) =>
        props.$darkThemeHome ? props.colors.white : props.colors.theme};
      font-size: larger;
      cursor: pointer;
    }
  }

  .documents {
    margin: 1em;
    align-self: flex-end;
  }
  .pagination {
    margin: 1em;
    align-self: center;
  }

  .add-discussion {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
      props.$darkThemeHome ? props.colors.white : props.colors.black};
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

const Discussions = (props) => {
  const [sort, setSort] = useState(
    JSON.parse(localStorage.getItem("discussionSort")) || {
      finished_at: -1,
    }
  );

  const [page, setPage] = useState(
    JSON.parse(localStorage.getItem("discussionPage")) || 1
  );

  const [noOfDocuments, setNoOfDocuments] = useState(
    JSON.parse(localStorage.getItem("discussionNoOfDocuments")) || 10
  );

  const [discussions, setDiscussions] = useState([]);

  const [key, setKey] = useState("Last Created");

  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState(
    JSON.parse(localStorage.getItem("discussionSearch")) || ""
  );

  const searchRef = useRef(null);

  const { colors, font, font_sizes, $darkThemeHome } = props;

  // useEffect(() => {
  //   localStorage.setItem("discussionSort", JSON.stringify(sort));
  // }, [sort]);

  // useEffect(() => {
  //   console.log(page);
  //   localStorage.setItem("discussionPage", JSON.stringify(page));
  // }, [page]);

  // useEffect(() => {
  //   localStorage.setItem(
  //     "discussionNoOfDocuments",
  //     JSON.stringify(noOfDocuments)
  //   );
  // }, [noOfDocuments]);

  // useEffect(() => {
  //   localStorage.setItem("discussionSearch", JSON.stringify(search));
  // }, [search]);

  const navigate = useNavigate();

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
          search: search,
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
  }, [sort, page, noOfDocuments, search]);

  useEffect(() => {
    axios
      .post(
        configData.PORT + "/pages1",
        {
          noOfDocuments: noOfDocuments,
          search: search,
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
  }, [noOfDocuments, search]);

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
      <div className="add-discussion">
        <StyledButton
          fontFamily={font}
          $darkTheme={$darkThemeHome}
          colors={colors}
          onClick={() => {
            navigate(`/discussions/addDiscussion`);
          }}
        >
          Add a discussion
        </StyledButton>
      </div>
      <div className="sort-bar">
        <SortBar
          keyprop={key}
          setKey={setKey}
          sort={sort}
          setSort={setSort}
          {...props}
        />
      </div>
      <div className="search-bar">
        <div className="wrapper">
          <input
            className="search"
            type="text"
            name="search"
            placeholder="Search through discussions..."
            ref={searchRef}
          />
          <BsSearch
            className="icon"
            onClick={() => {
              setSearch(searchRef.current.value);
            }}
          />
          <BsFillEraserFill
            className="icon"
            onClick={() => {
              searchRef.current.value = "";
              setSearch(searchRef.current.value);
            }}
          />
        </div>
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
