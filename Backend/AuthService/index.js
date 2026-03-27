const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // Using 5001 to avoid conflict with DummyZomato backend (which uses 5000)

app.use(cors());
app.use(express.json());

// Main Auth Route for User Dashboard
app.post('/auth/login', async (req, res) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({ message: "partnerId is required" });
    }

    // Call the DummyZomato API to verify the partnerId
    const zomatoResponse = await axios.post('http://localhost:5000/api/partners/login-partner-id', {
      partnerId: partnerId
    });

    // If successful, pass the response data back to the User Dashboard
    res.status(200).json(zomatoResponse.data);
  } catch (error) {
    console.error("AuthService Login Error:", error.response?.data || error.message);
    
    // Pass along whatever error the DummyZomato API sent, or a generic 500
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "Internal Auth Service Error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service is running on port ${PORT}`);
});
