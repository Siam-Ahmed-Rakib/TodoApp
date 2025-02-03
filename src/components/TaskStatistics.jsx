import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";

const TaskStatistics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://3.109.211.104:8001/todos", {
          headers: { accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">Error fetching tasks: {error}</div>;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.is_completed).length;
  const efficiency = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  const data = {
    labels: ["Completed", "Unfinished"],
    datasets: [
      {
        data: [completedTasks, totalTasks - completedTasks],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#66bb6a", "#ef5350"],
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  return (
    <div className="task-statistics" style={{ textAlign: "center", margin: "20px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Task Statistics</h2>
      <p style={{ fontSize: "18px" }}>Total Tasks: <b>{totalTasks}</b></p>
      <p style={{ fontSize: "18px" }}>Completed Tasks: <b>{completedTasks}</b></p>
      <p style={{ fontSize: "18px" }}>Efficiency: <b>{efficiency}%</b></p>
      <div style={{ width: "50%", margin: "0 auto" }}>
        <Pie data={data} options={options} />
      </div>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginTop: "20px", 
          padding: "10px 20px", 
          fontSize: "16px", 
          backgroundColor: "#007bff", 
          color: "#fff", 
          border: "none", 
          borderRadius: "5px", 
          cursor: "pointer" 
        }}
      >
        Back
      </button>
    </div>
  );
};

export default TaskStatistics;
