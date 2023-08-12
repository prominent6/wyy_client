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


// import axios from "axios";
// import Vue from "vue";

// let baseURL = "http://localhost:3000";
// axios.defaults.baseURL = baseURL;
// axios.interceptors.request.use((config) => {
//   const url = config.url;
//   if (url.indexOf("?") >= 0) {
//     config.url =
//       url + `&timestamp=${Date.now()}&cookie=${localStorage.getItem("cookie")}`;
//   } else {
//     config.url =
//       url + `?timestamp=${Date.now()}&cookie=${localStorage.getItem("cookie")}`;
//   }

//   //   console.log(config.url);
//   return config;
// });
// Vue.prototype.$request = axios;
