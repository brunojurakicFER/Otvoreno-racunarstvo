import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../Styles/Datatable.css';

const Datatable = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [data, setData] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3000/drivers', {
        params: {
          column: selectedColumn,
          value: searchValue
        }
      });
      setData(response.data.response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const downloadFile = async (format) => {
    try {
      const response = await axios.get(`http://localhost:3000/drivers/export/${format}`, {
        params: {
          column: selectedColumn,
          value: searchValue
        },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `filtered_drivers.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error downloading ${format} file:`, error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchValue, selectedColumn]);

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search value"
        />
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          <option value="">All columns (Wildcard)</option>
          <option value="name">Name</option>
          <option value="surname">Surname</option>
          <option value="nationality">Nationality</option>
          <option value="wins">Wins</option>
          <option value="podiums">Podiums</option>
          <option value="poles">Poles</option>
          <option value="points">Points</option>
          <option value="championships">Championships</option>
          <option value="races_done">Races Done</option>
          <option value="status">Status</option>
          <option value="current_team.name">Current Team Name</option>
          <option value="current_team.country">Current Team Country</option>
          <option value="current_team.founded_year">Current Team Founded Year</option>
          <option value="current_team.championships_won">Current Team Championships Won</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Surname</th>
          <th>Nationality</th>
          <th>Wins</th>
          <th>Podiums</th>
          <th>Poles</th>
          <th>Points</th>
          <th>Championships</th>
          <th>Races Done</th>
          <th>Status</th>
          <th>Current Team Name</th>
          <th>Current Team Country</th>
          <th>Current Team Founded Year</th>
          <th>Current Team Championships Won</th>
        </tr>
        </thead>
        <tbody>
        {data.map((driver) => (
          <tr key={driver._id}>
            <td>{driver.name}</td>
            <td>{driver.surname}</td>
            <td>{driver.nationality}</td>
            <td>{driver.wins}</td>
            <td>{driver.podiums}</td>
            <td>{driver.poles}</td>
            <td>{driver.points}</td>
            <td>{driver.championships}</td>
            <td>{driver.races_done}</td>
            <td>{driver.status}</td>
            <td>{driver.current_team.name}</td>
            <td>{driver.current_team.country}</td>
            <td>{driver.current_team.founded_year}</td>
            <td>{driver.current_team.championships_won}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <button className='index-btn' onClick={() => downloadFile('json')}>
        Download Filtered JSON
      </button>
      <button className='index-btn' onClick={() => downloadFile('csv')}>
        Download Filtered CSV
      </button>
    </div>
  );
};

export default Datatable;