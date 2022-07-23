import React, { useEffect } from "react";
import styled from "styled-components";
import parse, { domToReact } from "html-react-parser";
import Prism from "prismjs";

const DiscussionBodyDiv = styled.div`
  .body-discussion {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: auto;

    .pre {
      align-self: center;
      border: ${(props) =>
        props.$darkThemeHome
          ? `1px solid ${props.colors.black}`
          : `1px solid ${props.colors.theme}`};
      border-radius: 15px 15px 15px 15px;
      padding: 1em;
      margin: auto;
      margin-bottom: 0.5em;
    }
  }

  p{
    margin: 0.3em !important;
  }
`;

const DiscussionBody = (props) => {
  const { discussionBody } = props;
  //   console.log(discussionBody);

  useEffect(() => {
    props.$darkThemeHome
      ? require("prismjs/themes/prism-tomorrow.css")
      : require("prismjs/themes/prism-solarizedlight.css");
    Prism.highlightAll();
  }, []);

  const options = {
    replace: (domNode) => {
      if (domNode.name === "pre") {
        return (
          <pre className="pre">{domToReact(domNode.children, options)}</pre>
        );
      } else if (domNode.name === "code") {
        return (
          <code className="language-python">
            {domToReact(domNode.children, options)}
          </code>
        );
      }
    },
  };

  return (
    <DiscussionBodyDiv
      $darkThemeHome={props.$darkThemeHome}
      colors={props.colors}
      font={props.font}
      font_sizes={props.font_sizes}
    >
      {parse(
        `<div className="body-discussion">${discussionBody}</div>`,
        options
      )}
    </DiscussionBodyDiv>
  );
};

export default DiscussionBody;
