import React from "react";
import styled from "styled-components";
import { Pagination } from "react-bootstrap";

const PaginationDiv = styled.div`
`;

const StyledPagination = styled(Pagination)`
  font-family: ${(props) => props.font} !important;
  font-size: ${(props) => props.font_sizes.heading4};

  .page-item {
    .page-link {
      background-color: ${(props) =>
        props.$darkThemeHome ? props.colors.dark : props.colors.white};
      color: ${(props) =>
        props.$darkThemeHome ? props.colors.white : props.colors.black};
      border: 1px solid
        ${(props) =>
          props.$darkThemeHome ? props.colors.black : props.colors.theme};

      :hover {
        color: ${(props) =>
          props.$darkThemeHome ? props.colors.black : props.colors.white};
        background-color: ${(props) =>
          props.$darkThemeHome ? props.colors.white : props.colors.theme};
      }
    }
  }

  .page-item.active {
    .page-link {
      color: ${(props) =>
        props.$darkThemeHome ? props.colors.black : props.colors.white};
      background-color: ${(props) =>
        props.$darkThemeHome ? props.colors.white : props.colors.theme};
    }
  }
`;

const StyledPaginationFirst = styled(Pagination.First)``;

const StyledPaginationPrev = styled(Pagination.Prev)``;

const StyledPaginationItem = styled(Pagination.Item)``;

const StyledPaginationEllipsis = styled(Pagination.Ellipsis)``;

const StyledPaginationNext = styled(Pagination.Next)``;

const StyledPaginationLast = styled(Pagination.Last)``;

const PaginationComp = (props) => {
  const { page, setPage, pages } = props;

  console.log(props);

  const pagination_pages = (props) => {
    let pagesList = [];
    pagesList.push(
      <StyledPaginationItem
        active={page === 1}
        onClick={() => setPage(1)}
        key={1}
        colors={props.colors}
        $darkThemeHome={props.$darkThemeHome}
      >
        {1}
      </StyledPaginationItem>
    );
    if (pages - 2 <= 4) {
      for (let i = 2; i <= pages - 1; i++) {
        pagesList.push(
          <StyledPaginationItem
            active={page === i}
            onClick={() => setPage(i)}
            key={i}
            colors={props.colors}
            $darkThemeHome={props.$darkThemeHome}
          >
            {i}
          </StyledPaginationItem>
        );
      }
    } else {
      if (page <= 3) {
        for (let i = 2; i <= (pages - 1 > 3 ? 3 : pages - 1); i++) {
          pagesList.push(
            <StyledPaginationItem
              active={page === i}
              onClick={() => setPage(i)}
              key={i}
              colors={props.colors}
              $darkThemeHome={props.$darkThemeHome}
            >
              {i}
            </StyledPaginationItem>
          );
        }
        pagesList.push(
          <StyledPaginationEllipsis
            key="none"
            onClick={() => {
              setPage(page + 3);
            }}
            colors={props.colors}
            $darkThemeHome={props.$darkThemeHome}
          />
        );
      } else if (pages - page <= 2) {
        pagesList.push(
          <StyledPaginationEllipsis
            key="none"
            onClick={() => {
              setPage(page - 3);
            }}
            colors={props.colors}
            $darkThemeHome={props.$darkThemeHome}
          />
        );
        for (let i = pages - page < 2 ? pages - 2 : page; i < pages; i++) {
          pagesList.push(
            <StyledPaginationItem
              active={page === i}
              onClick={() => setPage(i)}
              key={i}
              colors={props.colors}
              $darkThemeHome={props.$darkThemeHome}
            >
              {i}
            </StyledPaginationItem>
          );
        }
      } else {
        pagesList.push(
          <StyledPaginationEllipsis
            key="none1"
            onClick={() => {
              setPage(page - 1);
            }}
            colors={props.colors}
            $darkThemeHome={props.$darkThemeHome}
          />
        );
        pagesList.push(
          <StyledPaginationItem
            active
            onClick={() => setPage(page)}
            key={page}
            colors={props.colors}
            $darkThemeHome={props.$darkThemeHome}
          >
            {page}
          </StyledPaginationItem>
        );
        pagesList.push(
          <StyledPaginationEllipsis
            key="none2"
            onClick={() => {
              setPage(page + 1);
            }}
            colors={props.colors}
            $darkThemeHome={props.$darkThemeHome}
          />
        );
      }
    }
    if (pages !== 1) {
      pagesList.push(
        <StyledPaginationItem
          active={page === pages}
          onClick={() => setPage(pages)}
          key={pages}
          colors={props.colors}
          $darkThemeHome={props.$darkThemeHome}
        >
          {pages}
        </StyledPaginationItem>
      );
    }
    return pagesList;
  };

  return (
    <PaginationDiv>
      <StyledPagination
        colors={props.colors}
        font={props.font}
        font_sizes={props.font_sizes}
        $darkThemeHome={props.$darkThemeHome}
      >
        <StyledPaginationFirst
          disabled={page === 1}
          onClick={() => setPage(1)}
          colors={props.colors}
          $darkThemeHome={props.$darkThemeHome}
        />
        <StyledPaginationPrev
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          colors={props.colors}
          $darkThemeHome={props.$darkThemeHome}
        />
        {pagination_pages({ ...props })}
        <StyledPaginationNext
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          colors={props.colors}
          $darkThemeHome={props.$darkThemeHome}
        />
        <StyledPaginationLast
          disabled={page === pages}
          onClick={() => setPage(pages)}
          colors={props.colors}
          $darkThemeHome={props.$darkThemeHome}
        />
      </StyledPagination>
    </PaginationDiv>
  );
};

export default PaginationComp;
