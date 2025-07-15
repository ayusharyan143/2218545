import axios from "axios";
import { getAuthToken } from "./auth.js";

let token = null;

const refreshAuthToken = async () => {
  token = await getAuthToken();
};

await refreshAuthToken();

export const log = async (stack, level, pkg, message) => {
  if (!token) await refreshAuthToken();

  try {
    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Log sent:", res.data.logID);
  } catch (err) {
    console.error("Logging Failed:", err.response?.data || err.message);
  }
};
