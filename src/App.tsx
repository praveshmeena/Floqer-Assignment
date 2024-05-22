
import React, { useEffect, useState } from 'react';
import MainTable from './components/MainTable';
import LineGraph from './components/LineGraph';
import JobTitlesTable from './components/JobTitlesTable';
import { fetchAndReadCSV } from './Utils/CSVReader';
import { SalaryData } from './Utils/types';
import './App.css';
import ChatApp from './components/chatApp';


const App: React.FC = () => {
  const [data, setData] = useState<SalaryData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await fetchAndReadCSV('/salaries.csv');
      setData(csvData);
    };
    fetchData();
  }, []);

  const handleRowClick = (year: number) => {
    setSelectedYear(year);
  };

  const aggregatedData = data.reduce((acc, curr) => {
    const year = curr.work_year;
    if (!acc[year]) {
      acc[year] = { year, totalJobs: 0, totalSalary: 0 };
    }
    acc[year].totalJobs += 1;
    acc[year].totalSalary += curr.salary_in_usd;
    return acc;
  }, {} as { [key: number]: { year: number; totalJobs: number; totalSalary: number } });

  const aggregatedArray = Object.values(aggregatedData).map(item => ({
    year: item.year,
    totalJobs: item.totalJobs,
    averageSalary: parseFloat((item.totalSalary / item.totalJobs).toFixed(3)), // Round to 3 decimal places
  }));

  const jobTitlesData = data
    .filter(item => item.work_year === selectedYear)
    .reduce((acc, curr) => {
      if (!acc[curr.job_title]) {
        acc[curr.job_title] = 0;
      }
      acc[curr.job_title] += 1;
      return acc;
    }, {} as { [key: string]: number });

  const jobTitlesArray = Object.entries(jobTitlesData).map(([job_title, count]) => ({
    job_title,
    count,
  }));

  return (
    <div className="App">
      <h1>Engineer Salaries</h1>
      <LineGraph data={aggregatedArray.map(d => ({ year: d.year, totalJobs: d.totalJobs }))} />
      <MainTable onRowClick={handleRowClick} />
      {selectedYear && <JobTitlesTable data={jobTitlesArray} />}
  
    </div>
  );
};

export default App;