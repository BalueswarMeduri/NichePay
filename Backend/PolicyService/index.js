const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002; // Using 5002 so it doesn't conflict with Auth (5001) or DummyZomato (5000)

app.use(cors());
app.use(express.json());

// Main Policy Service Route to Fetch Driver Profile
app.get('/api/policy/profile/:partnerId', async (req, res) => {
  try {
    const { partnerId } = req.params;

    // Fetch details from DummyZomato Service
    const zomatoResponse = await axios.get(`http://localhost:5000/api/partners/profile/${partnerId}`);

    // If successful, pass the response data back to the User Dashboard
    res.status(200).json(zomatoResponse.data);
  } catch (error) {
    console.error("PolicyService Profile Error:", error.response?.data || error.message);
    
    // Pass along whatever error the DummyZomato API sent, or a generic 500
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "Internal Policy Service Error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🛡️ Policy Service is running on port ${PORT}`);
});
