import React, { useState, useEffect, useRef } from 'react';

export default function PaginatedSearchFilter() {
  const [searchInput, setSearchInput] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    discipline: [],
    degree: [],
    accepted: [],
    PPO: [],
    session: [],
    companyName: []
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

  const handleReset = (name) => {
    setFilterOptions(prev => ({ ...prev, [name]: [] }));
    if (name === 'discipline') setFilteredDisciplines([]);
    if (name === 'companyName') setFilteredCompanies([]);
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
    <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-center mb-6">
        <img
          src="/Indian_Institute_of_Technology_Roorkee_Logo.svg"
          alt="IITR Logo"
          className="h-28 w-auto"
        />
      </div>
      <h2 className="text-2xl font-bold mb-6">Placement Data</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={dropdownRef}>
          {/* Discipline Filter */}
          <div className="relative">
            <input
              className="w-full p-2 border rounded"
              name="discipline"
              placeholder="Type Discipline"
              onChange={(e) => handleFilterChange('discipline', e.target.value)}
              onFocus={() => toggleDropdown('discipline')}
            />
            {openDropdown === 'discipline' && filteredDisciplines.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredDisciplines.map((discipline) => (
                  <li
                    key={discipline}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filterOptions.discipline.includes(discipline) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSelect('discipline', discipline)}
                  >
                    {discipline}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Degree Filter */}
          <div className="relative">
            <button
              className="w-full p-2 border rounded text-left bg-white"
              onClick={() => toggleDropdown('degree')}
            >
              {filterOptions.degree.length > 0 ? filterOptions.degree.join(', ') : 'Select Degree'}
            </button>
            {openDropdown === 'degree' && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {['B.Tech.', 'M.Tech.'].map((degree) => (
                  <li
                    key={degree}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filterOptions.degree.includes(degree) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSelect('degree', degree)}
                  >
                    {degree}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Acceptance Status Filter */}
          <div className="relative">
            <button
              className="w-full p-2 border rounded text-left bg-white"
              onClick={() => toggleDropdown('accepted')}
            >
              {filterOptions.accepted.length > 0 ? filterOptions.accepted.join(', ') : 'Select Acceptance Status'}
            </button>
            {openDropdown === 'accepted' && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {['Yes', 'No'].map((status) => (
                  <li
                    key={status}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filterOptions.accepted.includes(status) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSelect('accepted', status)}
                  >
                    {status}
                  </li>
                ))}
              </ul>
            )}
          </div>

            {/* PPO Status Filter */}
            <div className="relative">
            <button
              className="w-full p-2 border rounded text-left bg-white"
              onClick={() => toggleDropdown('PPO')}
            >
              {filterOptions.PPO.length > 0 ? filterOptions.PPO.join(', ') : 'Select PPO Status'}
            </button>
            {openDropdown === 'PPO' && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {['Yes', 'No'].map((status) => (
                  <li
                    key={status}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filterOptions.PPO.includes(status) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSelect('PPO', status)}
                  >
                    {status}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Session Filter */}
          <div className="relative">
            <button
              className="w-full p-2 border rounded text-left bg-white"
              onClick={() => toggleDropdown('session')}
            >
              {filterOptions.session.length > 0 ? filterOptions.session.join(', ') : 'Select Session'}
            </button>
            {openDropdown === 'session' && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {['2016-2017', '2017-2018', '2018-2019', '2019-2020', '2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'].map((session) => (
                  <li
                    key={session}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filterOptions.session.includes(session) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSelect('session', session)}
                  >
                    {session}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Company Name Filter */}
          <div className="relative">
            <input
              className="w-full p-2 border rounded"
              name="companyName"
              placeholder="Type Company Name"
              onChange={(e) => handleFilterChange('companyName', e.target.value)}
              onFocus={() => toggleDropdown('companyName')}
            />
            {openDropdown === 'companyName' && filteredCompanies.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredCompanies.map((company) => (
                  <li
                    key={company}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${filterOptions.companyName.includes(company) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSelect('companyName', company)}
                  >
                    {company}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Search and Apply Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by Enrolment No or Name"
            className="flex-grow p-2 border rounded"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Search
          </button>
        </div>

        {/* Display Applied Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(filterOptions).map(([key, values]) =>
            values.map(value => (
              <span key={`${key}-${value}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                {value}
                <button onClick={() => handleSelect(key, value)} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
              </span>
            ))
          )}
          {searchInput.trim() !== '' && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded flex items-center">
              {searchInput}
              <button onClick={() => { setSearchInput(''); handleApplyFilters(); }} className="ml-2 text-purple-600 hover:text-purple-800">×</button>
            </span>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="mt-8 overflow-x-auto">
        {results.length > 0 ? (
          <>
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Enrolment No</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Discipline</th>
                  <th className="p-2 border">Degree</th>
                  <th className="p-2 border">Accepted</th>
                  <th className="p-2 border">Session</th>
                  <th className="p-2 border">Contact No</th>
                  <th className="p-2 border">Email ID</th>
                  <th className="p-2 border">Company Name</th>
                  <th className="p-2 border">PPO</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.enrolmentNo} className="hover:bg-gray-50">
                    <td className="p-2 border">{result.enrolmentNo}</td>
                    <td className="p-2 border">{result.name}</td>
                    <td className="p-2 border">{result.discipline}</td>
                    <td className="p-2 border">{result.degree}</td>
                    <td className="p-2 border">{result.accepted}</td>
                    <td className="p-2 border">{result.session}</td>
                    <td className="p-2 border">{result.contactNo}</td>
                    <td className="p-2 border">{result.emailId}</td>
                    <td className="p-2 border">{result.companyName}</td>
                    <td className="p-2 border">{result.PPO}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-between items-center">
              <div>
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalResults)} of {totalResults} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(Number(currentPage) - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 border rounded bg-gray-100">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(Number(currentPage) + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center">No results found</p>
        )}
      </div>
    </div>
  );
}