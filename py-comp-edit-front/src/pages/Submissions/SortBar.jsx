import React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { useState } from "react";

const SortBarDiv = styled.div`
  border-radius: 15px 15px 15px 15px;
  border: 1px solid
    ${(props) =>
      props.$darkThemeHome ? props.colors.black : props.colors.theme};
  padding: 0.7em;
  background-color: ${(props) =>
    props.$darkThemeHome ? props.colors.dark : props.colors.white};
  color: ${(props) =>
    props.$darkThemeHome ? props.colors.white : props.colors.black};
  font-family: ${(props) => props.font} !important;
  font-size: ${(props) => props.font_sizes.heading4};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  .sort-item {
    cursor: pointer;

    .sort-selected {
      font-weight: bold;
    }
  }
`;

const SortBar = (props) => {
  const { sort, setSort, setKey } = props;

  const [sortOrder,setSortOrder]=useState(Object.values(sort)[0]);

  const key=props.keyprop;

  const sorts = {
    Default: { _id: sortOrder },
    "File Name": { fileName: sortOrder },
    Status: { "status.description": sortOrder },
    "Last Modified": { finished_at: sortOrder },
  };

  const handleSort = (e, key) => {
    e.preventDefault();
    setSortOrder(sortOrder===-1?1:-1);
    setKey(key);
  };



  useEffect(() => {
    setSort(sorts[key]);
  }, [key,sortOrder]);

  return (
    <SortBarDiv
      colors={props.colors}
      font={props.font}
      font_sizes={props.font_sizes}
      $darkThemeHome={props.$darkThemeHome}
    >
      {Object.keys(sorts).map((key1, index) => (
        <div
          className="sort-item"
          key={index}
          onClick={(e) => handleSort(e, key1)}
        >
          {key1 === key ? (
            <span className="sort-selected">
              {key1}
              {sortOrder === 1 ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
            </span>
          ) : (
            <span>{key1}</span>
          )}
        </div>
      ))}
    </SortBarDiv>
  );
};

export default SortBar;
