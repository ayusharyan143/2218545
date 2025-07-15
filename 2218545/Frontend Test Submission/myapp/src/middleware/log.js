import axios from 'axios';


async function Log(stack, level, pkg, message, token) {
  try {
    await axios.post(
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
  } catch (err) {
    console.error("Logging Failed:", err.message);
  }
}

export default Log;
