"use server";

import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";
import { API_URL } from "@/utils/constants";

const serverAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

serverAxios.interceptors.request.use(async (config) => {
  const accessToken = (await cookies()).get("token")?.value;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

serverAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message &&
      (error.response.data.message.includes("unauthenticated") ||
        error.response.data.message.includes("Unauthenticated"))
    ) {
      (await cookies()).delete("token");
      delete serverAxios.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

export default serverAxios;
