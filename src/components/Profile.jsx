import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';

export function Profile() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const [profile, setProfile] = useState(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        profile_picture: ""
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!username) {
            navigate("/login");
            return;
        }

        async function fetchProfile() {
            try {
                const response = await fetch(`http://3.109.211.104:8001/profile?username=${username}`);
                const data = await response.json();
                setProfile(data);
                setFormData(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        }

        fetchProfile();
    }, [username, navigate]);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleUpdate() {
        try {
            let updatedData = { ...formData };

            if (image) {
                const imageData = new FormData();
                imageData.append("image", image);
                const uploadResponse = await fetch("https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY", {
                    method: "POST",
                    body: imageData
                });
                const uploadData = await uploadResponse.json();
                updatedData.profile_picture = uploadData.data.url;
            }

            const response = await fetch("http://3.109.211.104:8001/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                toast.success("Profile updated successfully");
                setProfile(updatedData);
                setOpen(false);
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Update error", error);
            toast.error("Error updating profile");
        } finally {
            setOpen(false);
        }
    }

    function handleImageChange(e) {
        setImage(e.target.files[0]);
    }

    if (!profile) return <Typography textAlign="center">Loading...</Typography>;

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Avatar src={profile.profile_picture} sx={{ width: 100, height: 100 }} />
            <Typography variant="h4">{profile.name}</Typography>
            <Typography variant="body1"><b>Email:</b> {profile.email}</Typography>
            <Typography variant="body1"><b>Phone:</b> {profile.phone}</Typography>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mt: 2 }}>Edit Profile</Button>
            <Button variant="contained" color="secondary" onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>Back to Dashboard</Button>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box p={4} bgcolor="white" borderRadius={2} boxShadow={3} display="flex" flexDirection="column" gap={2} width={300} margin="auto" mt={10}>
                    <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
                    <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
                    <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <Button variant="contained" color="primary" onClick={handleUpdate}>Save</Button>
                </Box>
            </Modal>
        </Box>
    );
}
