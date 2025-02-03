import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  padding: theme.spacing(3),
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "400px",
  background: "#fff",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  marginTop: theme.spacing(2),
}));

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

  if (loading) return <Container><CircularProgress color="inherit" /></Container>;
  if (error) return <Container><Typography variant="h6">Error: {error}</Typography></Container>;

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
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Task Statistics
      </Typography>
      <Typography variant="h6">Total Tasks: <b>{totalTasks}</b></Typography>
      <Typography variant="h6">Completed Tasks: <b>{completedTasks}</b></Typography>
      <Typography variant="h6">Efficiency: <b>{efficiency}%</b></Typography>
      
      <ChartContainer>
        <Pie data={data} options={options} />
      </ChartContainer>
      
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate(-1)}
        sx={{ marginTop: 2 }}
      >
        Back
      </Button>
    </Container>
  );
};

export default TaskStatistics;
