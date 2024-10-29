// src/components/PaginatedSearchFilter/SearchBar.jsx
import React from 'react';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search } from 'lucide-react';

const SearchBar = ({ searchInput, setSearchInput, handleSearch }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search by Enrolment No or Name"
        className="flex-grow bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
      />
      <Button
        className="bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-800"
        onClick={handleSearch}
      >
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
    </div>
  );
};

export default SearchBar;
