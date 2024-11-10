import '../Styles/Index.css'
import Datatable from "./Datatable.jsx";
import DatasetInfo from "./DatasetInfo.jsx";

const Index = () => {
  return (
    <div>
      <DatasetInfo/>
      <button className='index-btn' onClick={() => {
        window.location.href = '/datatable';
      }}>Show datatable</button>
      <div className='index-link-wrapper'>
        <a href='http://localhost:3000/drivers/json' className='index-link'>Download JSON</a>
        <a href='http://localhost:3000/drivers/csv' className='index-link'>Download CSV</a>
      </div>
    </div>
  )
}

export default Index