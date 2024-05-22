
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { fetchAndReadCSV } from '../Utils/CSVReader';
import { SalaryData } from '../Utils/types';
import './MainTable.css';

interface AggregatedData {
  key: number;
  work_year: number;
  totalJobs: number;
  averageSalary: number;
}

const MainTable: React.FC<{ onRowClick: (year: number) => void }> = ({ onRowClick }) => {
  const [data, setData] = useState<SalaryData[]>([]);
  const [sortedColumn, setSortedColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'ascend' | 'descend'>('ascend');

  useEffect(() => {
    const fetchData = async () => {
      const csvData = await fetchAndReadCSV('/salaries.csv');
      setData(csvData);
    };
    fetchData();
  }, []);

  const handleSort = (pagination: any, filters: any, sorter: any) => {
    setSortedColumn(sorter.field);
    setSortDirection(sorter.order);
  };

  const columns = [
    {
      title: 'Year',
      dataIndex: 'work_year',
      key: 'work_year',
      sorter: (a: AggregatedData, b: AggregatedData) => a.work_year - b.work_year,
      sortOrder: sortedColumn === 'work_year' ? sortDirection : undefined,
    },
    {
      title: 'Total Jobs',
      dataIndex: 'totalJobs',
      key: 'totalJobs',
      sorter: (a: AggregatedData, b: AggregatedData) => a.totalJobs - b.totalJobs,
      sortOrder: sortedColumn === 'totalJobs' ? sortDirection : undefined,
    },
    {
      title: 'Average Salary (USD)',
      dataIndex: 'averageSalary',
      key: 'averageSalary',
      sorter: (a: AggregatedData, b: AggregatedData) => a.averageSalary - b.averageSalary,
      sortOrder: sortedColumn === 'averageSalary' ? sortDirection : undefined,
      render: (value: number) => value.toFixed(3), // Round to 3 decimal places
    },
  ];

  const aggregatedData: AggregatedData[] = Object.values(data.reduce((acc, curr) => {
    const year = curr.work_year;
    if (!acc[year]) {
      acc[year] = { key: year, work_year: year, totalJobs: 0, totalSalary: 0 };
    }
    acc[year].totalJobs += 1;
    acc[year].totalSalary += curr.salary_in_usd;
    return acc;
  }, {} as { [key: number]: { key: number; work_year: number; totalJobs: number; totalSalary: number } })).map(item => ({
    ...item,
    averageSalary: item.totalSalary / item.totalJobs,
  })); 

  return (
    <div className="main-table-container">
      <Table
        columns={columns}
        dataSource={aggregatedData}
        onChange={handleSort}
        pagination={false} 
        onRow={(record) => ({
          onClick: () => onRowClick(record.work_year),
        })}
      />
    </div>
  );
};

export default MainTable;