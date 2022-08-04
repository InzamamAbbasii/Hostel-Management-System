const BASE_URL = 'http://192.168.1.102/HMSAPI/api/';

export let api = {
  login: BASE_URL + 'Auth/Login',
  signup: BASE_URL + 'Auth/Register',
  getUsers: BASE_URL + 'Auth/GetUsers',
  addHostel: BASE_URL + 'HostelManager/AddHostel',
  addRoom: BASE_URL + 'HostelManager/AddRoom',
};
