import API from "./api";

export const login = (email, password) =>
  API.post("/login", { email, password });
