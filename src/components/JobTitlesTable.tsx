
import React from 'react';
import { Table } from 'antd';
import './JobTitlesTable.css';

interface JobTitlesData {
  job_title: string;
  count: number;
}

const JobTitlesTable: React.FC<{ data: JobTitlesData[] }> = ({ data }) => {
  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'job_title',
      key: 'job_title',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  return (
    <div className="job-titles-table-container">
      <Table
        columns={columns}
        dataSource={data.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
      />
    </div>
  );
};

export default JobTitlesTable;