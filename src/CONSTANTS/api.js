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
  get_room_detail: BASE_URL + 'api/HostelManager/GetRoomDetail',
  update_room: BASE_URL + 'api/HostelManager/UpdateRoom',
  delete_room: BASE_URL + 'api/HostelManager/DeleteRoom',
  delete_hostel: BASE_URL + 'api/HostelManager/DeleteHostel',
  get_Hostel_Detail: BASE_URL + 'api/HostelManager/GetHostelDetail',
  delete_hostel_Images: BASE_URL + 'api/HostelManager/DeleteHostelImage',
  update_hostel: BASE_URL + 'api/HostelManager/UpdateHostel',

  //Admin api's
  get_Hostels: BASE_URL + 'api/Admin/GetHostels',
  get_All_Hostelers: BASE_URL + 'api/Admin/GetAllHostelers',
  get_Hostels_Request: BASE_URL + 'api/Admin/Get_NewHostels_Request',
  approve_Hostel: BASE_URL + 'api/Admin/ApproveHostel',
  reject_Hostel: BASE_URL + 'api/Admin/RejectHostel',
  get_HostelManagers_List: BASE_URL + 'api/Admin/GetHostelManagers',
  get_Hostel_By_InstitudeName: BASE_URL + 'api/Admin/GetHostelsByInstitudeName',

  //User api's
  book_room: BASE_URL + 'api/User/BookRoom',
  addFeedback: BASE_URL + 'api/User/SaveFeedback',
  get_Rating_and_Reviews: BASE_URL + 'api/User/GetReviewsAndRating',
  get_booked_hostels: BASE_URL + 'api/User/MyHostels',
  get_User_Approved_Hostels: BASE_URL + 'api/User/UserApprovedHostels',
  get_User_Pending_Hostels: BASE_URL + 'api/User/UserPendingHostels',
  checkout: BASE_URL + 'api/User/Checkout',
  add_Favorite: BASE_URL + 'api/User/AddFavorite',
  remove_Favorite: BASE_URL + 'api/User/RemoveFavorite',
  get_Favorite_Hostels: BASE_URL + 'api/User/GetFavoriteHostels',
};
