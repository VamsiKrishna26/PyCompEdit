import { render, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import DiscussionBody from "./DiscussionBody";

afterEach(cleanup);

const props = {
  discussionBody:
    "<p>I have two Python dictionaries, and I want to write a single expression that returns these two dictionaries, merged.  The <code>update()</code> method would be what I need, if it returned its result instead of modifying a dict in-place.</p>\n\n<pre><code>&gt;&gt;&gt; x = {'a':1, 'b': 2}\n&gt;&gt;&gt; y = {'b':10, 'c': 11}\n&gt;&gt;&gt; z = x.update(y)\n&gt;&gt;&gt; print z\nNone\n&gt;&gt;&gt; x\n{'a': 1, 'b': 10, 'c': 11}\n</code></pre>\n\n<p>How can I get that final merged dict in z, not x?</p>\n\n<p>(To be extra-clear, the last-one-wins conflict-handling of <code>dict.update()</code> is what I'm looking for as well.)</p>\n",
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
};
test("on initial render Discussion Body component", () => {
  render(<DiscussionBody {...props}/>);
});
