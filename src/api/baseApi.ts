import axios from "axios";
axios.defaults.timeout = 3000;
const request = axios.create({
    baseURL: "/api",
});
export default request;

