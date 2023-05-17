//创建一个axios实例
import axios from "axios";
export function request(url, params) {
  const instance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 3000,
    withCredentials: true,
  });
  instance.defaults.withCredentials = true;
  if (params) {
    const query = { params };
    return instance.get(url, query);
  } else {
    return instance.get(url);
  }
}
