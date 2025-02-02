import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import toast from "react-hot-toast";

export function Todo({ title, description, deadline, priority, is_completed, id, updateTodos }) {
  const [localCompleted, setLocalCompleted] = useState(is_completed);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    setLocalCompleted(is_completed);
  }, [is_completed]);

  useEffect(() => {
    function updateCountdown() {
      if (localCompleted) {
        setTimeLeft("Done");
        return;
      }

      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        setTimeLeft("Invalid Date");
        return;
      }

      const now = new Date();
      const diff = deadlineDate - now;
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeLeft(`${days > 0 ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [deadline, localCompleted]);

  async function completeTodo() {
    try {
      const formattedDeadline = new Date(deadline).toISOString();
      const response = await fetch(`http://3.109.211.104:8001/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          deadline: formattedDeadline,
          priority,
          is_completed: true,
        }),
      });
      if (!response.ok) throw new Error("Failed to update");
      toast.success("Todo marked as completed");
      setLocalCompleted(true);
      updateTodos();
    } catch (error) {
      toast.error("Failed to update todo");
    }
  }

  async function deleteTodo() {
    try {
      const response = await fetch(`http://3.109.211.104:8001/todo/${id}`, {
        method: "DELETE",
        headers: {
          "accept": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete");
      toast.error("Todo deleted", { id: `delete-${id}`, duration: 2000 });
      updateTodos();
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  }

  return (
    <Card
      sx={{
        maxWidth: 400,
        m: 2,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: localCompleted ? "#e0f7fa" : timeLeft === "Expired" ? "#ffebee" : "#fff3e0",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Priority: <strong>{priority}</strong>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: localCompleted ? "green" : timeLeft === "Expired" ? "red" : "orange",
            fontWeight: "bold",
          }}
        >
          Status: {localCompleted ? "Completed" : timeLeft === "Expired" ? "Expired" : "Pending"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Time Left: <strong>{timeLeft}</strong>
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircleIcon />}
            onClick={completeTodo}
            disabled={localCompleted}
          >
            Complete
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={deleteTodo}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
