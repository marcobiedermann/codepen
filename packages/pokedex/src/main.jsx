import React from 'https://cdn.skypack.dev/react@17';
import { render } from 'https://cdn.skypack.dev/react-dom@17';
import InfiniteScroll from 'https://cdn.skypack.dev/react-infinite-scroller@1';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from 'https://cdn.skypack.dev/react-query@3';

const LANGUAGE = 'en';
const LIMIT = 20;

const queryClient = new QueryClient();

async function fetchUrl(url) {
  const response = await fetch(url);
  const result = await response.json();

  return result;
}

async function fetchPokemons({ pageParam = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}` }) {
  return fetchUrl(pageParam);
}

function getColor(type) {
  const colors = new Map([
    ['bug', '#a6b91a'],
    ['dark', '#705746'],
    ['dragon', '#6f35fc'],
    ['electric', '#f7d02c'],
    ['fairy', '#d685ad'],
    ['fighting', '#c22e28'],
    ['fire', '#ee8130'],
    ['flying', '#a98ff3'],
    ['ghost', '#735797'],
    ['grass', '#7ac74c'],
    ['ground', '#e2bf65'],
    ['ice', '#96d9d6'],
    ['normal', '#a8a77a'],
    ['poison', '#a33ea1'],
    ['psychic', '#f95587'],
    ['rock', '#b6a136'],
    ['steel', '#b7b7ce'],
    ['water', '#6390f0'],
  ]);

  return colors.get(type) || '#777';
}

function Loader() {
  return <div>Loading …</div>;
}

function Error(props) {
  return <div {...props} />;
}

function Pokemon(props) {
  const { url } = props;
  const {
    data: pokemon,
    isLoading: pokemonIsLoading,
    isError: pokemonIsError,
    error: pokemonError,
  } = useQuery(['pokemons', url], () => fetchUrl(url));
  const speciesUrl = pokemon?.species.url;
  const {
    data: species,
    isLoading: speciesIsLoading,
    isError: speciesIsError,
    error: speciesError,
  } = useQuery(['species', speciesUrl], () => fetchUrl(speciesUrl), {
    enabled: !!speciesUrl,
  });

  if (pokemonIsLoading || speciesIsLoading) {
    return <Loader />;
  }

  if (pokemonIsError) {
    return <Error>{pokemonError?.message}</Error>;
  }

  if (speciesIsError) {
    return <Error>{speciesError?.message}</Error>;
  }

  const { id, sprites, types } = pokemon;
  const { name } = species.names.find((name) => name.language.name === LANGUAGE);
  const color = getColor(types[0].type.name);
  const gradient = types.map((type) => getColor(type.type.name)).join(', ');
  const imageSize = 96;

  return (
    <div
      className="pokemon"
      style={{
        backgroundColor: color,
        backgroundImage: `linear-gradient(45deg, ${gradient})`,
      }}
    >
      <h3 className="pokemon__name">{name}</h3>
      <span className="pokemon__id">{`#${id.toString().padStart(3, '0')}`}</span>
      <ol className="pokemon__types">
        {types.map((type) => (
          <li key={type.slot}>
            <span className="pokemon__type">{type.type.name}</span>
          </li>
        ))}
      </ol>
      <img alt={name} height={imageSize} src={sprites.front_default} width={imageSize} />
    </div>
  );
}

function Pokemons(props) {
  const { pokemons } = props;

  return (
    <>
      {pokemons.map((pokemon) => {
        const { url } = pokemon;

        return (
          <li key={url}>
            <Pokemon {...pokemon} />
          </li>
        );
      })}
    </>
  );
}

function Grid(props) {
  return <div className="grid" {...props} />;
}

function App() {
  const { data, error, fetchNextPage, hasNextPage, isLoading, isError } = useInfiniteQuery(
    'pokemons',
    fetchPokemons,
    {
      getNextPageParam: (lastPage) => lastPage.next,
      getPreviousPageParam: (firstPage) => firstPage.previous,
    },
  );

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error>{error?.message}</Error>;
  }

  return (
    <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
      <Grid>
        <h1>Pokedex</h1>
        <ol className="pokemons">
          {data?.pages.map((page, index) => (
            <Pokemons key={`page-${index}`} pokemons={page.results} />
          ))}
        </ol>
      </Grid>
    </InfiniteScroll>
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
