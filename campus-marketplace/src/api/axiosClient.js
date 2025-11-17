import axios from "axios";

const axiosClient=axios.create({
    baseURL:"http://Localhost:5000",
    Headers:
    {
        "Content-Type":"application/json",
    },
});

export default axiosClient;