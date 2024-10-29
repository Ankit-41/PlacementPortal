// src/components/PaginatedSearchFilter/FilterInputs.jsx
import React from 'react';
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X } from 'lucide-react';

const FilterInputs = ({
  disciplines,
  filteredDisciplines,
  companies,
  filteredCompanies,
  openDropdown,
  handleFilterChange,
  handleSelect,
  toggleDropdown
}) => {
  return (
    <>
      {/* Discipline Input */}
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
                  className={`w-full justify-start ${discipline.includes(discipline) ? 'bg-accent dark:bg-accent-dark' : ''} text-gray-800 dark:text-gray-200`}
                  onClick={() => handleSelect('discipline', discipline)}
                >
                  {discipline}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Company Name Input */}
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
                  className={`w-full justify-start ${company.includes(company) ? 'bg-accent dark:bg-accent-dark' : ''} text-gray-800 dark:text-gray-200`}
                  onClick={() => handleSelect('companyName', company)}
                >
                  {company}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default FilterInputs;
