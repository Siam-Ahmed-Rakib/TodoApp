import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { Todo } from "./Todo";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { CreateTodoModal } from "./CreateTodoModal";
import toast from 'react-hot-toast';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

export function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [todolist, setTodoList] = useState([]);
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [sortBy, setSortBy] = useState("");

    async function getTodos() {
        try {
            const response = await fetch("http://3.109.211.104:8001/todos");
            const data = await response.json();
            setTodoList(data);
        } catch (error) {
            console.error("Failed to fetch todos", error);
        }
    }

    useEffect(() => {
        if (!username) navigate("/login");
        getTodos();
    }, []);

    function logoutClick() {
        localStorage.removeItem("username");
        toast.success("Logged out successfully");
        navigate("/login");
    }

    const filteredTodos = todolist.filter(todo => 
        todo.title.toLowerCase().includes(search.toLowerCase()) && 
        (priorityFilter === "" || 
         (priorityFilter === "1-5" && todo.priority >= 1 && todo.priority <= 5) ||
         (priorityFilter === "6-10" && todo.priority >= 6 && todo.priority <= 10) ||
         (priorityFilter === "10+" && todo.priority > 10))
    );

    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sortBy === "priority") return a.priority - b.priority;
        if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
        if (sortBy === "creation") return new Date(a.created_at) - new Date(b.created_at);
        return 0;
    });

    return (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" p={3}>
            <Box width={{ xs: "100%", sm: "500px" }} p={2} boxShadow={3} borderRadius={2} bgcolor="white">
                <Box display='flex' justifyContent="space-between" alignItems="center" mb={2}>
                    <h1>Welcome, {username}!</h1>
                    <Button variant="outlined" size="large" color="error" onClick={logoutClick}>Logout</Button>
                </Box>
                <TextField fullWidth placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} variant="outlined" margin="dense" />
                
                <FormControl fullWidth margin="dense" variant="outlined">
                    <InputLabel>Filter by Priority</InputLabel>
                    <Select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} label="Filter by Priority">
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="1-5">1-5</MenuItem>
                        <MenuItem value="6-10">6-10</MenuItem>
                        <MenuItem value="10+">10+</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense" variant="outlined">
                    <InputLabel>Sort by</InputLabel>
                    <Select value={sortBy} onChange={e => setSortBy(e.target.value)} label="Sort by">
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                        <MenuItem value="deadline">Deadline</MenuItem>
                        <MenuItem value="creation">Creation Time</MenuItem>
                    </Select>
                </FormControl>

                <Box mt={2}>
                    {sortedTodos.map(todo => (
                        <Todo key={todo.id} {...todo} updateTodos={getTodos} />
                    ))}
                </Box>
                <CreateTodoModal updateTodos={getTodos} />
            </Box>
        </Box>
    );
}
