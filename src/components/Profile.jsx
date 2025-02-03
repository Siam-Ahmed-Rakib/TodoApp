import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import toast from "react-hot-toast";

export function Profile() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false); // NEW STATE TO FORCE RE-RENDER
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profile_picture: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!username) {
      navigate("/login");
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://3.109.211.104:8001/profile/${username}`,
          {
            headers: { Accept: "application/json" },
          }
        );
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
  }, [username, navigate, refresh]); // REFETCH WHEN refresh CHANGES

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d{0,11}$/.test(value)) return; // Allow only up to 11 digits

    setFormData({ ...formData, [name]: value });
  }

  async function handleUpdate() {
    try {
      let updatedData = { ...formData };

      // Validate phone number (exactly 11 digits)
      if (!/^\d{11}$/.test(updatedData.phone)) {
        toast.error("Phone number must be exactly 11 digits.");
        return;
      }

      // If an image is selected, upload it
      if (image) {
        const imageData = new FormData();
        imageData.append("image", image);

        const uploadResponse = await fetch(
          "https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY",
          {
            method: "POST",
            body: imageData,
          }
        );

        if (!uploadResponse.ok) {
          toast.error("Image upload failed. Please try again.");
          return;
        }

        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          toast.error("Image upload failed. Please try again.");
          return;
        }

        updatedData.profile_picture = uploadData.data.url;
      }

      // Send the updated profile data
      const response = await fetch(
        `http://3.109.211.104:8001/profile/${username}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setOpen(false);
        setRefresh((prev) => !prev); // TRIGGER RE-RENDER BY TOGGLING refresh
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      toast.error(
        "An error occurred while updating the profile. Please try again."
      );
    }
  }

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Typography textAlign="center" variant="h6" color="error">
        Unable to load profile. Please try again later.
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Card sx={{ width: 400, p: 3, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Avatar
              src={profile.profile_picture}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              {profile.name}
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
            >
              <b>Email:</b> {profile.email}
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
            >
              <b>Phone:</b> {profile.phone}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            sx={{ mx: 1 }}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/dashboard")}
            sx={{ mx: 1 }}
          >
            Back to Dashboard
          </Button>
        </CardActions>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          p={4}
          bgcolor="white"
          borderRadius={3}
          boxShadow={5}
          display="flex"
          flexDirection="column"
          gap={2}
          width={{ xs: "90%", sm: "400px" }}
          margin="auto"
          mt={10}
        >
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            inputProps={{ maxLength: 11 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "10px" }}
          />
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
