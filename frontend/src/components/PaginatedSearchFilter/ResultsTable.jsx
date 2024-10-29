// src/components/PaginatedSearchFilter/ResultsTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

const ResultsTable = ({ results }) => {
  return (
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
  );
};

export default ResultsTable;
