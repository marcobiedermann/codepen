import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { render } from 'https://cdn.skypack.dev/react-dom@17';
import { useQuery, QueryClient, QueryClientProvider } from 'https://cdn.skypack.dev/react-query@3';

const queryClient = new QueryClient();

const Movie = (props) => {
  const { poster_path, title, vote_average } = props;

  return (
    <div className="movie">
      <figure className="movie__figure">
        <img
          src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${poster_path}`}
          className="movie__poster"
        />
        <figcaption>
          <span className="movie__vote">{vote_average}</span>
        </figcaption>
        <h2 className="movie__title">{title}</h2>
      </figure>
    </div>
  );
};

const Movies = (props) => {
  const { movies } = props;

  return (
    <ul className="movies">
      {movies.map((movie) => (
        <li key={movie.id}>
          <Movie {...movie} />
        </li>
      ))}
    </ul>
  );
};

const Search = (props) => {
  const { onInput, query, ...otherProps } = props;

  return (
    <form className="search" onInput={onInput}>
      <input type="search" value={query} {...otherProps} />
    </form>
  );
};

const API_BASE = 'https://api.themoviedb.org/3';
const API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1M2ZmNjljNmRiM2YxMjgxZTk2ZTRlODQ5ZWRhNmQ2NSIsInN1YiI6IjU2YzRhZmU1YzNhMzY4MGQzZTAwMDIyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-TqKfzJ2O4yVBYI0aiaUDgkg_WDRhOoRfnC5U-QE2SU';

async function fetcher(url) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

function App() {
  const [query, setQuery] = useState('');

  const url = query ? `/search/movie?query=${query}` : '/movie/popular';
  const { isLoading, isError, data, error } = useQuery([url, url], () => fetcher(url));

  if (isError) {
    return <div>Error: {error}</div>;
  }

  function onInput(event) {
    const { value } = event.target;

    setQuery(value);
  }

  return (
    <div className="app">
      <Search query={query} onInput={onInput} placeholder="Search for Movie Title …" />
      {isLoading ? <div>Loading …</div> : <Movies movies={data.results} />}
    </div>
  );
}

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

render(<Root />, document.getElementById('root'));
