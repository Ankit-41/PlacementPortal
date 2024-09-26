import { useState } from 'react';
import axios from 'axios';
import FilterComponent from './FilterComponent';

const SearchComponent = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const isEnrolmentNo = /^\d+$/.test(searchInput);
      const params = isEnrolmentNo ? { enrolmentNo: searchInput } : { name: searchInput };

      const response = await axios.get('http://localhost:3001/api/placements/search', { params });
      setSearchResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <FilterComponent searchInput={searchInput} />
      <div style={{ marginLeft: '20px' }}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by Enrolment No or Name"
        />
        <button onClick={handleSearch}>Search</button>

        <ul>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <li key={result.enrolmentNo}>{result.name} - {result.companyName}</li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent;
