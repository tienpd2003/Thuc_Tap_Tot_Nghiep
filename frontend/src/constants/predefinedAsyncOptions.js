import { API_BASE_URL } from ".";

const predefinedAsyncOptions = [
  {
    id: "departments",
    name: "Danh sách bộ phận",
    endpoint: API_BASE_URL + "/departments",
    method: "GET",
    dataPath: "data",
  },
  {
    id: "employees",
    name: "Danh sách nhân viên",
    endpoint: API_BASE_URL + "/roles/1/users",
    method: "GET",
    dataPath: "data",
  },
  {
    id: "approvers",
    name: "Danh sách người duyệt",
    endpoint: API_BASE_URL + "/roles/2/users",
    method: "GET",
    dataPath: "data",
  },
  {
    id: "admins",
    name: "Danh sách quản trị viên",
    endpoint: API_BASE_URL + "/roles/3/users",
    method: "GET",
    dataPath: "data",
  },
  {
    id: "provinces",
    name: "Danh sách tỉnh/thành phố",
    endpoint: "https://provinces.open-api.vn/api/",
    method: "GET",
    dataPath: "",
  },
  {
    id: "districts",
    name: "Danh sách quận/huyện",
    endpoint: "https://provinces.open-api.vn/api/d/",
    method: "GET",
    dataPath: "districts",
  },
  {
    id: "wards",
    name: "Danh sách phường/xã",
    endpoint: "https://provinces.open-api.vn/api/w/",
    method: "GET",
    dataPath: "wards",
  },
];

export default predefinedAsyncOptions;
