import axios from "axios";
axios.interceptors.request.use(
  (config) => {
    console.log("data");
    const data = JSON.parse(localStorage.getItem("token"));
    console.log(data.accessToken);
    if (data) {
      config.headers["authorization"] = `Bearer ${
        data.accessToken
      }`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
