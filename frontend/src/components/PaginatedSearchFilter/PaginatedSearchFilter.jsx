// src/components/PaginatedSearchFilter/PaginatedSearchFilter.jsx
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ToggleSwitch from '@/components/ToggleSwitch';
import FilterInputs from './FilterInputs';
import SelectFilters from './SelectFilters';
import SearchBar from './SearchBar';
import FilterBadges from './FilterBadges';
import ResultsTable from './ResultsTable';
import Pagination from './Pagination';

export default function PaginatedSearchFilter() {
  // State declarations...
  const [searchInput, setSearchInput] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    discipline: [],
    degree: [],
    accepted: [],
    PPO: [],
    session: [],
    companyName: []
  });
  const [selectValues, setSelectValues] = useState({
    degree: '',
    accepted: '',
    PPO: '',
    session: '',
  });
  const [results, setResults] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [openDropdown, setOpenDropdown] = useState('');
  const dropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [limit, setLimit] = useState(10);

  // Fetch options and handle clicks outside dropdown
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const disciplineResponse = await fetch('/disciplines.txt');
        const companyResponse = await fetch('/companyNames.txt');
        const disciplineData = await disciplineResponse.text();
        const companyData = await companyResponse.text();

        setDisciplines(disciplineData.split('\n').filter(Boolean));
        setCompanies(companyData.split('\n').filter(Boolean));
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown('');
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    if (name === 'discipline' || name === 'companyName') {
      const filtered = name === 'discipline' ? disciplines : companies;
      const setFiltered = name === 'discipline' ? setFilteredDisciplines : setFilteredCompanies;
      setFiltered(filtered.filter(item => item.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilterOptions(prev => ({
        ...prev,
        [name]: prev[name].includes(value)
          ? prev[name].filter(item => item !== value)
          : [...prev[name], value]
      }));
    }
  };

  // Handle selection from dropdowns
  const handleSelect = (name, value) => {
    setFilterOptions(prev => {
      const updatedOptions = prev[name].includes(value)
        ? { ...prev, [name]: prev[name].filter(item => item !== value) }
        : { ...prev, [name]: [...prev[name], value] };

      handleApplyFilters(updatedOptions, 1);
      return updatedOptions;
    });

    if (name === 'discipline') setFilteredDisciplines([]);
    if (name === 'companyName') setFilteredCompanies([]);
    setOpenDropdown('');
  };

  // Apply filters and fetch results
  const handleApplyFilters = async (updatedFilterOptions = filterOptions, page = currentPage) => {
    try {
      const params = new URLSearchParams();
      Object.entries(updatedFilterOptions).forEach(([key, values]) => {
        if (values.length > 0) {
          params.append(key, values.join(','));
        }
      });

      if (searchInput.trim() !== '') {
        const isEnrolmentNo = /^\d+$/.test(searchInput.trim());
        if (isEnrolmentNo) {
          params.append('enrolmentNo', searchInput.trim());
        } else {
          params.append('name', searchInput.trim());
        }
      }

      params.append('page', page.toString());
      params.append('limit', limit.toString());
      const response = await fetch(`https://placement-portal-backend-ankit-41-ankit-41s-projects.vercel.app/api/placements/filter?${params.toString()}`);
      const data = await response.json();
      console.log(data);
      setResults(data.data);
      setTotalPages(Math.ceil(data.total / data.limit));
      setTotalResults(data.total);
      setCurrentPage(data.page);
      setLimit(data.limit);
    } catch (error) {
      console.error('Error fetching filter results:', error);
    }
  };

  // Toggle dropdown visibility
  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? '' : name);
  };

  // Handle search action
  const handleSearch = async () => {
    await handleApplyFilters(filterOptions, 1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      handleApplyFilters(filterOptions, newPage);
    }
  };

  return (
    <Card className="max-w-7xl mx-auto bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader className="flex justify-between items-center">
        <div className="text-center">
          <img
            src="/Indian_Institute_of_Technology_Roorkee_Logo.svg"
            alt="IITR Logo"
            className="h-28 w-auto mx-auto mb-4"
          />
          <CardTitle className="text-gray-900 dark:text-gray-100 mb-3">Placement Data</CardTitle>
        </div>
        <ToggleSwitch />
      </CardHeader>
      <CardContent className="text-gray-800 dark:text-gray-200 sm:p-2">
        <div className="space-y-6">
          {/* Filter Inputs and Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={dropdownRef}>
            <FilterInputs
              disciplines={disciplines}
              filteredDisciplines={filteredDisciplines}
              companies={companies}
              filteredCompanies={filteredCompanies}
              openDropdown={openDropdown}
              handleFilterChange={handleFilterChange}
              handleSelect={handleSelect}
              toggleDropdown={toggleDropdown}
            />
            <SelectFilters
              selectValues={selectValues}
              handleSelect={handleSelect}
            />
          </div>

          {/* Search Bar */}
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
          />

          {/* Filter Badges */}
          <FilterBadges
            filterOptions={filterOptions}
            searchInput={searchInput}
            handleSelect={handleSelect}
            handleApplyFilters={handleApplyFilters}
          />
        </div>

        {/* Results and Pagination */}
        <div className="mt-8">
          {results.length > 0 ? (
            <>
              <ResultsTable results={results} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                limit={limit}
                handlePageChange={handlePageChange}
              />
            </>
          ) : (
            <p className="text-center text-gray-800 dark:text-gray-200">No results found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
