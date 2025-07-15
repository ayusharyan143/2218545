import axios from "axios";

export const getAuthToken = async () => {
  try {
    const res = await axios.post("http://20.244.56.144/evaluation-service/auth", {
      email: "ayusharyan686@gmail.com",
      name: "Ayush Aryan",
      rollNo: "2218545",
      accessCode: "QAhDUr",
      clientID: "bf762096-31bf-4b3a-9cec-8fe5a80e594e",
      clientSecret: "ZqnvaQzzUBJnPTCn"
    });

    return res.data.access_token;  
  } catch (err) {
    console.error("Auth Failed:", err.response?.data || err.message);
    throw err;  
  }
};
