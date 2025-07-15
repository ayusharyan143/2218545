import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";
import log from "../middleware/log";
import axios from "axios";

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([{ url: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", validity: "", shortcode: "" }]);
    }
  };

  const handleSubmit = async () => {
    const output = [];

    for (let i = 0; i < inputs.length; i++) {
      const { url, validity, shortcode } = inputs[i];

      if (!url || !url.startsWith("http")) {
        alert(`URL at index ${i + 1} is invalid`);
        log("frontend", "error", "component", `Invalid URL: ${url}`);
        continue;
      }

      const body = {
        url,
        ...(validity && { validity: parseInt(validity) }),
        ...(shortcode && { shortcode }),
      };

      try {
        const res = await axios.post("http://localhost:5000/shorturls", body);
        output.push({
          shortLink: res.data.shortLink,
          expiry: res.data.expiry,
          originalUrl: url,
        });

        log("frontend", "info", "component", `Shortened URL created: ${res.data.shortLink}`);
      } catch (err) {
        alert(`Failed for URL ${url}`);
        log("frontend", "error", "component", `Shortener failed: ${err.message}`);
      }
    }

    setResults(output);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Shorten Your URL
      </Typography>
      {inputs.map((input, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Original URL"
              fullWidth
              value={input.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Minutes"
              fullWidth
              type="number"
              value={input.validity}
              onChange={(e) => handleChange(index, "validity", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Custom Short Name"
              fullWidth
              value={input.shortcode}
              onChange={(e) => handleChange(index, "shortcode", e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

      <Button variant="outlined" onClick={addField} disabled={inputs.length >= 5}>
        Add Another URL
      </Button>
      <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2 }}>
        Shorten All
      </Button>

      <Box sx={{ mt: 4 }}>
        {results.map((res, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Original: {res.originalUrl}</Typography>
            <Typography>
              Short Link: <a href={res.shortLink}>{res.shortLink}</a>
            </Typography>
            <Typography>Expires At: {res.expiry}</Typography>
            <hr />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ShortenerPage;
