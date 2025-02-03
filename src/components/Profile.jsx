import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Card, CardActions, CardContent, CircularProgress, Modal, TextField, Typography } from "@mui/material";
import { toast } from "react-hot-toast";

export function Profile() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", profile_picture: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!username) {
      navigate("/login");
      return;
    }
    async function fetchProfile() {
      try {
        setLoading(true);
        const response = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${username}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setFormData(data);
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        toast.error("Error loading profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username, navigate, refresh]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d{0,11}$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  }

  async function handleUpdate() {
    try {
      let updatedData = { ...formData };
      if (!/^\d{11}$/.test(updatedData.phone)) {
        toast.error("Phone number must be exactly 11 digits.");
        return;
      }
      if (image) {
        const imageData = new FormData();
        imageData.append("image", image);
        const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?expiration=600&key=c567e6b09d0f8e2c7e553ce140f9ce5c`, { method: "POST", body: imageData });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadData.success) {
          toast.error("Image upload failed. Please check your API key and try again.");
          return;
        }
        updatedData.profile_picture = uploadData.data.url;
      }
      const response = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        toast.success("Profile updated successfully!");
        setOpen(false);
        setRefresh((prev) => !prev);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile. Please try again.");
    }
  }

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#e3f2fd" p={2}>
      <Card sx={{ width: 400, p: 3, boxShadow: 5, borderRadius: 3, bgcolor: "#ffffff" }}>
        <CardContent>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Avatar src={profile.profile_picture} sx={{ width: 120, height: 120, mb: 2, border: "3px solid #1976d2" }} />
            <Typography variant="h5" fontWeight="bold" color="#1976d2" textAlign="center">{profile.name}</Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary"><b>Email:</b> {profile.email}</Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary"><b>Phone:</b> {profile.phone}</Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mx: 1 }}>Edit Profile</Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/dashboard")} sx={{ mx: 1 }}>Back to Dashboard</Button>
        </CardActions>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box p={4} bgcolor="white" borderRadius={3} boxShadow={5} display="flex" flexDirection="column" gap={2} width={{ xs: "90%", sm: "400px" }} margin="auto" mt={10}>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
          <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth inputProps={{ maxLength: 11 }} />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "10px" }} />
          <Button variant="contained" color="primary" onClick={handleUpdate}>Save</Button>
        </Box>
      </Modal>
    </Box>
  );
}
