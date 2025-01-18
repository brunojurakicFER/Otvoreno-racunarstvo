'use client'

import React from 'react';
import Header from "@/components/Header";
import DatasetInfo from "@/components/DatasetInfo";
import '@/Styles/DatasetInfo.css'
import '@/Styles/Index.css'

const Page = () => {
  return (
    <div>
      <Header/>
      <div>
        <DatasetInfo/>
        <button className='index-btn m-3' onClick={() => {
          window.location.href = '/datatable';
        }}>Show datatable
        </button>
        <div className='index-link-wrapper m-3'>
          <a href='http://localhost:10000/drivers/json' className='index-link'>Download JSON</a>
          <a href='http://localhost:10000/drivers/csv' className='index-link'>Download CSV</a>
        </div>
      </div>
    </div>
  );
};

export default Page;