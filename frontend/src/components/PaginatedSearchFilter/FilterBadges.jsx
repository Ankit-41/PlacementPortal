// src/components/PaginatedSearchFilter/FilterBadges.jsx
import React from 'react';
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { X } from 'lucide-react';

const FilterBadges = ({ filterOptions, searchInput, handleSelect, handleApplyFilters }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(filterOptions).map(([key, values]) =>
        values.map(value => (
          <Badge key={`${key}-${value}`} variant="secondary" className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
            {value}
            <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0" onClick={() => handleSelect(key, value)}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))
      )}
      {searchInput.trim() !== '' && (
        <Badge variant="secondary" className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
          {searchInput}
          <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0" onClick={() => { handleSelect('search', ''); handleApplyFilters(); }}>
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
};

export default FilterBadges;
