import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import log from "../middleware/log";

const StatsPage = () => {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    if (!code.trim()) {
      alert("Please enter a shortcode");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${code}`);
      setStats(res.data);
      log("frontend", "info", "component", `Fetched stats for: ${code}`);
    } catch (err) {
      alert("Shortcode not found or expired.");
      setStats(null);
      log("frontend", "error", "component", `Stats fetch failed: ${err.message}`);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        View URL Stats
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Enter Shortcode"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button variant="contained" onClick={fetchStats}>
          Get Stats
        </Button>
      </Box>

      {stats && (
        <Box>
          <Typography>Original URL: {stats.originalUrl}</Typography>
          <Typography>Created At: {new Date(stats.createdAt).toLocaleString()}</Typography>
          <Typography>Expires At: {new Date(stats.expiry).toLocaleString()}</Typography>
          <Typography>Total Clicks: {stats.totalClicks}</Typography>

          <Typography sx={{ mt: 2 }} variant="h6">
            Click Logs
          </Typography>
          {stats.clicks.length === 0 ? (
            <Typography>No clicks recorded yet.</Typography>
          ) : (
            stats.clicks.map((click, idx) => (
              <Box key={idx} sx={{ mb: 1, pl: 2, borderLeft: "2px solid gray" }}>
                <Typography>{new Date(click.timestamp).toLocaleString()}</Typography>
                <Typography>Referrer: {click.referrer}</Typography>
                <Typography>Location: {click.location}</Typography>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default StatsPage;
