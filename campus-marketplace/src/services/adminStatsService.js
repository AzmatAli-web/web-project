import client from "../api/axiosClient";
export default {
  getDashboardData: async () =>
    (await client.get("/admin/stats/dashboard")).data,
};
