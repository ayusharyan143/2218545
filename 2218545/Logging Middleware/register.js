import axios from "axios";

const register = async () => {
  try {
    const res = await axios.post("http://20.244.56.144/evaluation-service/register", {
      email: "ayusharyan686@gmail.com",
      name: "Ayush Aryan",
      mobileNo: "6395274229",
      githubusername: "ayusharyan143",
      rollNo: "2218545",
      accessCode: "QAhDUr"
    });

    console.log("Registered!");
    console.log("Client ID:", res.data.clientID);
    console.log("Client Secret:", res.data.clientSecret);
  } catch (err) {
    console.error("Registration Failed:", err.response?.data || err.message);
  }
};

register();
