// src/components/PaginatedSearchFilter/Pagination.jsx
import React from 'react';
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, totalResults, limit, handlePageChange }) => {
  return (
    <div className="mt-4 flex justify-between items-center text-gray-800 dark:text-gray-200">
      <div>
        Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalResults)} of {totalResults} results
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-800 dark:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled className="text-gray-800 dark:text-gray-200">
          {currentPage} of {totalPages}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-800 dark:text-gray-200"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
