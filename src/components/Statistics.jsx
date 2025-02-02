import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import toast from 'react-hot-toast';

export function Statistics() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    async function fetchTodos() {
      const response = await fetch("http://3.109.211.104:8001/todos");
      const data = await response.json();
      setTasks(data);
    }
    fetchTodos();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.is_completed).length;
  const efficiency = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, totalTasks - completedTasks],
        backgroundColor: ['#36A2EB', '#FF6384']
      }
    ]
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Task Statistics</h1>
      <p>Total Tasks: {totalTasks}</p>
      <p>Completed Tasks: {completedTasks}</p>
      <p>Efficiency: {efficiency}%</p>
      <div style={{ width: '300px', margin: 'auto' }}>
        <Pie data={chartData} />
      </div>
    </div>
  );
}
