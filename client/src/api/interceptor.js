import axios from "axios";
axios.interceptors.request.use(
  (config) => {
    const data = JSON.parse(localStorage.getItem("token"));
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
