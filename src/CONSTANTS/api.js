// const BASE_URL = 'http://192.168.1.102/HMSAPI/api/';
const BASE_URL = 'http://192.168.1.102/HMSAPI/';

export let api = {
  //image
  image: BASE_URL + 'Images/',
  //auth api's
  login: BASE_URL + 'api/Auth/Login',
  signup: BASE_URL + 'api/Auth/Register',
  getUsers: BASE_URL + 'api/Auth/GetUsers',

  //Hostel Manager api's
  addHostel: BASE_URL + 'api/HostelManager/AddHostel',
  addRoom: BASE_URL + 'api/HostelManager/AddRoom',
  get_Pending_Hostels: BASE_URL + 'api/HostelManager/GetPendingHostels',
  get_Approved_Hostels: BASE_URL + 'api/HostelManager/GetApprovedHostels',
  get_Booking_Request: BASE_URL + 'api/HostelManager/GetBookingRequest',
  approve_Booking: BASE_URL + 'api/HostelManager/ApproveBooking',
  reject_Booking: BASE_URL + 'api/HostelManager/RejectBooking',

  //Admin api's
  get_Hostels: BASE_URL + 'api/Admin/GetHostels',
  get_All_Hostelers: BASE_URL + 'api/Admin/GetAllHostelers',
  get_Hostels_Request: BASE_URL + 'api/Admin/Get_NewHostels_Request',
  approve_Hostel: BASE_URL + 'api/Admin/ApproveHostel',
  reject_Hostel: BASE_URL + 'api/Admin/RejectHostel',
  get_HostelManagers_List: BASE_URL + 'api/Admin/GetHostelManagers',

  //User api's
  book_room: BASE_URL + 'api/User/BookRoom',
  addFeedback: BASE_URL + 'api/User/SaveFeedback',
  get_Rating_and_Reviews: BASE_URL + 'api/User/GetReviewsAndRating',
  get_booked_hostels: BASE_URL + 'api/User/MyHostels',
  checkout: BASE_URL + 'api/User/Checkout',
};
