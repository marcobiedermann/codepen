import React, { StrictMode } from "https://esm.run/react@18";
import { createRoot } from "https://esm.run/react-dom@18/client";
import useTimeout from "https://esm.run/react-use@17/esm/useTimeout";

function Loading() {
  return /*#__PURE__*/React.createElement("div", null, "Loading \u2026");
}

const levelMap = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6" };


function Heading(props) {
  const { level = 1, ...otherProps } = props;
  const Component = levelMap[level];

  return /*#__PURE__*/React.createElement(Component, otherProps);
}

const ONE_SECOND_IN_MS = 1000;

function InfiniteChildren(props) {
  const { level = 1, maxLevel = 20 } = props;
  const [isReady] = useTimeout(ONE_SECOND_IN_MS);

  if (!isReady()) {
    return /*#__PURE__*/React.createElement(Loading, null);
  }

  return /*#__PURE__*/(
    React.createElement("div", { className: "infinite-child" }, /*#__PURE__*/
    React.createElement(Heading, { level: Math.min(level, 6) }, "Level ", level),

    level === maxLevel ? /*#__PURE__*/
    React.createElement("div", null, "Done!") : /*#__PURE__*/

    React.createElement(InfiniteChildren, { level: level + 1 })));



}

createRoot(document.getElementById("root")).render( /*#__PURE__*/
React.createElement(StrictMode, null, /*#__PURE__*/
React.createElement(InfiniteChildren, null)));