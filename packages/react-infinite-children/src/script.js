import React, { StrictMode } from "https://esm.run/react@18";
import { createRoot } from "https://esm.run/react-dom@18/client";
import useTimeout from "https://esm.run/react-use@17/esm/useTimeout";

function Loading() {
  return <div>Loading …</div>;
}

const levelMap = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6"
};

function Heading(props) {
  const { level = 1, ...otherProps } = props;
  const Component = levelMap[level];

  return <Component {...otherProps} />;
}

const ONE_SECOND_IN_MS = 1000;

function InfiniteChildren(props) {
  const { level = 1, maxLevel = 20 } = props;
  const [isReady] = useTimeout(ONE_SECOND_IN_MS);

  if (!isReady()) {
    return <Loading />;
  }

  return (
    <div className="infinite-child">
      <Heading level={Math.min(level, 6)}>Level {level}</Heading>

      {level === maxLevel ? (
        <div>Done!</div>
      ) : (
        <InfiniteChildren level={level + 1} />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <InfiniteChildren />
  </StrictMode>
);
