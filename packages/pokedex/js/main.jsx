import React from "react";
import { render } from "react-dom";
import useSWR, { SWRConfig } from "swr";

async function fetcher(url) {
  const response = await fetch(`https://pokeapi.co/api/v2${url}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

const Pokemon = (props) => {
  const { data, error } = useSWR("/pokemon/1");
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      <h2>{data.name}</h2>
    </div>
  );
};

const App = (props) => {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <Pokemon />
    </SWRConfig>
  );
};

render(<App />, document.getElementById("root"));
