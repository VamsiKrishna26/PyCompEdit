import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import configData from "../../config.json";
import { createStructuredSelector } from "reselect";
import { Dropdown, Table } from "react-bootstrap";
import PaginationComp from "./Pagination";
import SortBar from "./SortBar";
import Submission from "./Submission";
import { selectUser } from "../../redux/user/user.selecter";
import { connect } from "react-redux";
import Filters from "./Filters";

const SubmissionsDiv = styled.div`
  margin: 1em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .sort-bar {
  }

  .table-filer {
    display: flex;
    align-items: center;
    justify-content: center;
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
    props.$darkThemeHome ? "" : `1px solid ${props.colors.theme}`};
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

const StyledTable = styled(Table)`
  margin-top: 1em;
  font-family: ${(props) => props.font};
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};

  thead {
    background-color: ${(props) =>
      props.$darkThemeHome ? props.colors.black : props.colors.white};
  }

  tbody {
    background-color: ${(props) =>
      props.$darkThemeHome ? props.colors.dark : props.colors.white};
  }
`;

const Submissions = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [sort, setSort] = useState({ finished_at: -1 });

  const [page, setPage] = useState(1);

  const [noOfDocuments, setNoOfDocuments] = useState(10);

  const [submissions, setSubmissions] = useState([]);

  const [key, setKey] = useState("Last Modified");

  const [pages, setPages] = useState(1);

  const navigate = useNavigate();

  const { colors, font, font_sizes, $darkThemeHome, user } = props;

  // useEffect(() => {
  //   console.log(page);
  // }, [page]);

  // useEffect(() => {
  //   console.log(sortOrder);
  // }, [sortOrder]);

  useEffect(() => {
    try {
      setPage(parseInt(searchParams.get("page")));
    } catch {
      navigate(`/submissions?page=${page}`);
    }
  }, []);

  useEffect(() => {
    console.log(sort, page, noOfDocuments);
    axios
      .post(
        configData.PORT + "/submissions",
        {
          userId: user.userId,
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
      .then((response) => setSubmissions(response.data))
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
        configData.PORT + "/pages",
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

  const documents = [5, 10, 15, 25, 50];

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
    <SubmissionsDiv
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
      <div className="table-filter">
        <Filters/>
        <StyledTable
          responsive
          bordered
          font={font}
          $darkThemeHome={$darkThemeHome}
          colors={colors}
        >
          <thead>
            <tr>
              <th style={{ width: "5%" }}>S.No</th>
              <th style={{ width: "25%" }}>File Name</th>
              <th style={{ width: "20%" }}>Language</th>
              <th style={{ width: "20%" }}>Last Submission</th>
              <th style={{ width: "20%" }}>Status</th>
              <th style={{ width: "10%" }}>More</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((item, i) => (
              <Submission
                key={i}
                index={i}
                submission={item}
                colors={colors}
                font={font}
                font_sizes={font_sizes}
                $darkThemeHome={$darkThemeHome}
                page={page}
                noOfDocuments={noOfDocuments}
                {...props}
              />
            ))}
          </tbody>
        </StyledTable>
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
    </SubmissionsDiv>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
});

export default connect(mapStateToProps)(Submissions);
