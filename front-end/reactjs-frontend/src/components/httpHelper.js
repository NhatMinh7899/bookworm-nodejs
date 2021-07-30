import axios from "axios";

const endPoint = "http://localhost:8080/api";

export function get(url){
   return axios.get(endPoint+url);
}

export function post(url, data){
   return axios.post(endPoint+url, data);
}