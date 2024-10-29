// src/components/PaginatedSearchFilter/SelectFilters.jsx
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

const SelectFilters = ({ selectValues, handleSelect }) => {
  const degrees = ['B.Tech.', 'M.Tech.', 'IDD'];
  const acceptanceStatuses = ['Yes', 'No'];
  const ppoStatuses = ['Yes', 'No'];
  const sessions = [
    '2016-2017', '2017-2018', '2018-2019', '2019-2020',
    '2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025'
  ];

  return (
    <>
      {/* Degree Select */}
      <Select
        value={selectValues.degree}
        onValueChange={(value) => {
          handleSelect('degree', value);
        }}>
        <SelectTrigger className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
          <SelectValue placeholder="Select Degree" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700">
          {degrees.map((degree) => (
            <SelectItem key={degree} value={degree} className="text-gray-800 dark:text-gray-200">
              {degree}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Accepted Status Select */}
      <Select
        value={selectValues.accepted}
        onValueChange={(value) => {
          handleSelect('accepted', value);
        }}>
        <SelectTrigger className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
          <SelectValue placeholder="Select Acceptance Status" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700">
          {acceptanceStatuses.map((status) => (
            <SelectItem key={status} value={status} className="text-gray-800 dark:text-gray-200">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* PPO Status Select */}
      <Select
        value={selectValues.PPO}
        onValueChange={(value) => {
          handleSelect('PPO', value);
        }}>
        <SelectTrigger className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
          <SelectValue placeholder="Select PPO Status" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700">
          {ppoStatuses.map((status) => (
            <SelectItem key={status} value={status} className="text-gray-800 dark:text-gray-200">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Session Select */}
      <Select
        value={selectValues.session}
        onValueChange={(value) => {
          handleSelect('session', value);
        }}>
        <SelectTrigger className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
          <SelectValue placeholder="Select Session" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700">
          {sessions.map((session) => (
            <SelectItem key={session} value={session} className="text-gray-800 dark:text-gray-200">
              {session}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectFilters;
