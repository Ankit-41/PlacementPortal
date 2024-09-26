import { useState, useEffect } from 'react';
import axios from 'axios';

const FilterComponent = ({ searchInput }) => {
  const [filterOptions, setFilterOptions] = useState({
    discipline: '',
    degree: '',
    accepted: '',
    session: '',
    companyName: ''
  });
  const [filterResults, setFilterResults] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const disciplineResponse = await fetch('/disciplines.txt');
      const companyResponse = await fetch('/companyNames.txt');
      const disciplineData = await disciplineResponse.text();
      const companyData = await companyResponse.text();

      setDisciplines(disciplineData.split('\n'));
      setCompanies(companyData.split('\n'));
    };

    fetchOptions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions({ ...filterOptions, [name]: value });

    if (name === 'discipline') {
      setFilteredDisciplines(disciplines.filter(d => d.toLowerCase().includes(value.toLowerCase())));
    } else if (name === 'companyName') {
      setFilteredCompanies(companies.filter(c => c.toLowerCase().includes(value.toLowerCase())));
    }
  };

  const handleSelect = (name, value) => {
    setFilterOptions({ ...filterOptions, [name]: value });
    if (name === 'discipline') setFilteredDisciplines([]);
    if (name === 'companyName') setFilteredCompanies([]);
  };

  const handleReset = (name) => {
    setFilterOptions({ ...filterOptions, [name]: '' });
    if (name === 'discipline') setFilteredDisciplines([]);
    if (name === 'companyName') setFilteredCompanies([]);
  };

  const handleDone = async () => {
    try {
      const params = {
        ...filterOptions,
        name: searchInput || undefined
      };
      const response = await axios.get('http://localhost:3001/api/placements/filter', { params });
      setFilterResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching filter results:', error);
    }
  };

  return (
    <div style={{ float: 'left', width: '25%', padding: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <input
            name="discipline"
            placeholder="Type Discipline"
            value={filterOptions.discipline}
            onChange={handleFilterChange}
          />
          {filterOptions.discipline && (
            <button onClick={() => handleReset('discipline')}>✖</button>
          )}
          {filteredDisciplines.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredDisciplines.map((discipline) => (
                <li key={discipline} onClick={() => handleSelect('discipline', discipline)}>
                  {discipline}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select name="degree" onChange={handleFilterChange}>
          <option value="">Select Degree</option>
          <option value="B.Tech.">B.Tech.</option>
          <option value="M.Tech.">M.Tech.</option>
        </select>

        {/* <select name="ppo" onChange={handleFilterChange}>
          <option value="">Select PPO Status</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select> */}

        <select name="accepted" onChange={handleFilterChange}>
          <option value="">Select Acceptance Status</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="session" onChange={handleFilterChange}>
          <option value="">Select Session</option>
          <option value="2016-2017">2016-2017</option>
          <option value="2017-2018">2017-2018</option>
          <option value="2018-2019">2018-2019</option>
          <option value="2019-2020">2019-2020</option>
          <option value="2020-2021">2020-2021</option>
          <option value="2021-2022">2021-2022</option>
          <option value="2022-2023">2022-2023</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2024-2025">2024-2025</option>
        </select>

        <div>
          <input
            name="companyName"
            placeholder="Type Company Name"
            value={filterOptions.companyName}
            onChange={handleFilterChange}
          />
          {filterOptions.companyName && (
            <button onClick={() => handleReset('companyName')}>✖</button>
          )}
          {filteredCompanies.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredCompanies.map((company) => (
                <li key={company} onClick={() => handleSelect('companyName', company)}>
                  {company}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={handleDone}>Done</button>
      </div>

      {filterResults.length > 0 && (
        <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Enrolment No</th>
              <th>Name</th>
              <th>Discipline</th>
              <th>Degree</th>
              <th>Contact No</th>
              <th>Email ID</th>
              <th>Accepted</th>
              <th>Session</th>
              <th>Company Name</th>
              <th>PPO</th>
            </tr>
          </thead>
          <tbody>
            {filterResults.map((result) => (
              <tr key={result.enrolmentNo}>
                <td>{result.enrolmentNo}</td>
                <td>{result.name}</td>
                <td>{result.discipline}</td>
                <td>{result.degree}</td>
                <td>{result.contactNo}</td>
                <td>{result.emailId}</td>
                <td>{result.accepted}</td>
                <td>{result.session}</td>
                <td>{result.companyName}</td>
                <td>{result.PPO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FilterComponent;
