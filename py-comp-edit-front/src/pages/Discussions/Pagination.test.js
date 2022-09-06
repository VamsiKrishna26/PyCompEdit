import { render, fireEvent, cleanup, screen } from "@testing-library/react";
import React from "react";
import PaginationComp from "./Pagination";

afterEach(cleanup);

const props={
    page:2,
    pages:51,
    setPage:()=>{},
    $darkThemeHome: true,
  colors: {
    dark: "rgb(66,66,66)",
    white: "white",
    theme: "#4b0082",
    black: "black",
    dark_bg: "rgb(128, 128, 128)",
  },
  font_sizes: {
    heading1: "28px",
    heading2: "24px",
    heading3: "20px",
    heading4: "18px",
    text: "16px",
  },
  font:"'Kantumruy Pro', sans-serif"
}

test('it renders properly',()=>{
    render(<PaginationComp {...props}/>);
    screen.debug()
});