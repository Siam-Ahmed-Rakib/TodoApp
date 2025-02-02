import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
};

export function CreateTodoModal({ updateTodos }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  async function createTodoClick() {
    if (!title || !priority || !deadline) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const priorityValue = parseInt(priority);
    if (priorityValue < 0) {
      toast.error("Priority cannot be negative");
      return;
    }
    
    const body = {
      title,
      description,
      deadline: new Date(deadline).toISOString(),
      priority: priorityValue,
    };
    
    try {
      const r = await fetch("http://3.109.211.104:8001/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("Failed to create todo");
      
      toast.success("Todo created");
      setTitle("");
      setPriority("");
      setDescription("");
      setDeadline("");
      setIsOpen(false);
      updateTodos();
    } catch (error) {
      toast.error("Error creating todo");
    }
  }

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} variant="contained" size="large">
        Create
      </Button>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div style={style}>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "100%" }}>
            <h2 style={{ textAlign: "center" }}>Add a Todo</h2>
            <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} margin="normal" />
            <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} margin="normal" />
            <TextField fullWidth label="Deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Priority" type="number" value={priority} onChange={(e) => setPriority(e.target.value)} margin="normal" inputProps={{ min: 0 }} />
            <Button onClick={createTodoClick} fullWidth variant="contained" size="large" style={{ marginTop: "10px" }}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
