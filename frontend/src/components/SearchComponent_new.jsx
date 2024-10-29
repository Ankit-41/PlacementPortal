// src/components/PaginatedSearchFilter.jsx
'use client'

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import ToggleSwitch from '@/components/ToggleSwitch'; // Import the ToggleSwitch component

export default function PaginatedSearchFilter() {
  // Access theme context if needed (not required since ToggleSwitch handles it)
  
  // Existing states...
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

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? '' : name);
  };

  const handleSearch = async () => {
    await handleApplyFilters(filterOptions, 1);
  };

  const handlePageChange = (newPage) => {
    console.log(newPage);
    console.log(totalPages);
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
        {/* Theme Toggle Switch Positioned at Top Right */}
        <ToggleSwitch />
      </CardHeader>
      <CardContent className="text-gray-800 dark:text-gray-200 sm:p-2">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={dropdownRef}>
            <div className="relative">
              <Input
                name="discipline"
                placeholder="Type Branch here"
                className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                onChange={(e) => handleFilterChange('discipline', e.target.value)}
                onFocus={() => toggleDropdown('discipline')}
              />
              {openDropdown === 'discipline' && filteredDisciplines.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-700">
                  <CardContent className="p-0">
                    {filteredDisciplines.map((discipline) => (
                      <Button
                        key={discipline}
                        variant="ghost"
                        className={`w-full justify-start ${filterOptions.discipline.includes(discipline) ? 'bg-accent dark:bg-accent-dark' : ''} text-gray-800 dark:text-gray-200`}
                        onClick={() => handleSelect('discipline', discipline)}
                      >
                        {discipline}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Repeat similar dark mode adjustments for Select components */}
            <Select
              value={selectValues.degree}
              onValueChange={(value) => {
                handleSelect('degree', value);
                setSelectValues(prev => ({ ...prev, degree: '' }));
              }}>
              <SelectTrigger className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Select Degree" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                {['B.Tech.', 'M.Tech.', 'IDD'].map((degree) => (
                  <SelectItem key={degree} value={degree} className="text-gray-800 dark:text-gray-200">
                    {degree}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectValues.accepted}
              onValueChange={(value) => {
                handleSelect('accepted', value);
                setSelectValues(prev => ({ ...prev, accepted: '' }));
              }}>
              <SelectTrigger className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Select Acceptance Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                {['Yes', 'No'].map((status) => (
                  <SelectItem key={status} value={status} className="text-gray-800 dark:text-gray-200">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectValues.PPO}
              onValueChange={(value) => {
                handleSelect('PPO', value);
                setSelectValues(prev => ({ ...prev, PPO: '' }));
              }}>
              <SelectTrigger className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Select PPO Status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                {['Yes', 'No'].map((status) => (
                  <SelectItem key={status} value={status} className="text-gray-800 dark:text-gray-200">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectValues.session}
              onValueChange={(value) => {
                handleSelect('session', value);
                setSelectValues(prev => ({ ...prev, session: '' }));
              }}>
              <SelectTrigger className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700">
                {['2016-2017', '2017-2018', '2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'].map((session) => (
                  <SelectItem key={session} value={session} className="text-gray-800 dark:text-gray-200">
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                name="companyName"
                placeholder="Type Company Name"
                className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                onChange={(e) => handleFilterChange('companyName', e.target.value)}
                onFocus={() => toggleDropdown('companyName')}
              />
              {openDropdown === 'companyName' && filteredCompanies.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-700">
                  <CardContent className="p-0">
                    {filteredCompanies.map((company) => (
                      <Button
                        key={company}
                        variant="ghost"
                        className={`w-full justify-start ${filterOptions.companyName.includes(company) ? 'bg-accent dark:bg-accent-dark' : ''} text-gray-800 dark:text-gray-200`}
                        onClick={() => handleSelect('companyName', company)}
                      >
                        {company}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

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
                <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0" onClick={() => { setSearchInput(''); handleApplyFilters(); }}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-8">
          {results.length > 0 ? (
            <>
              <Table className="bg-white dark:bg-gray-700">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Enrolment No</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Name</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Branch</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Degree</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Accepted</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Session</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Contact No</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Email ID</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">Company Name</TableHead>
                    <TableHead className="text-center text-gray-900 dark:text-gray-100">PPO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index} className="bg-white dark:bg-gray-700">
                      <TableCell className="text-center text-gray-800 dark:text-gray-200">
                        <a
                          href={`https://channeli.in/student_profile/${result.enrolmentNo}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {result.enrolmentNo}
                        </a>
                      </TableCell>

                      <TableCell className="text-gray-800 dark:text-gray-200">{result.name}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{result.discipline}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{result.degree}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{result.accepted}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{result.session}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{result.contactNo}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{result.emailId}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{result.companyName}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{result.PPO}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-between items-center text-gray-800 dark:text-gray-200">
                <div>
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalResults)} of {totalResults} results
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Number(currentPage) - 1)}
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
                    onClick={() => handlePageChange(Number(currentPage) + 1)}
                    disabled={currentPage === totalPages}
                    className="text-gray-800 dark:text-gray-200"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-800 dark:text-gray-200">No results found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
