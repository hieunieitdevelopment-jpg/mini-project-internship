import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";

function SearchPage() {
  return (
    <div>
      <h1>Address Lookup</h1>

      <SearchBar />

      <SearchResult />
    </div>
  );
}

export default SearchPage;