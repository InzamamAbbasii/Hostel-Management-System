using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HMSApi.Models;
namespace HMSApi.Controllers
{
    public class UserController : ApiController
    {
        Hostel_Management_SystemEntities db = new Hostel_Management_SystemEntities();

        [HttpPost]
        public HttpResponseMessage BookRoom(BookingRequest bookingRequest)
        {
            try
            {
                db.BookingRequests.Add(bookingRequest);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK,"true");   
            }
            catch (Exception ex)
            {
              return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);    
            }
        }

        [HttpPost]
        public HttpResponseMessage SaveFeedback(FeedBack feedBack)
        {
            try
            {
                db.FeedBacks.Add(feedBack);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "true");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpGet]
        public HttpResponseMessage GetReviewsAndRating(int id) //id -> hostel id
        {
            try
            {
                var list = db.FeedBacks.Join(db.Users,
                                                      f => f.User_Id,
                                                      u => u.Id,
                                                      (f, u) => new { f, u }
                                                    ).Where(w=>w.f.H_Id==id)
                                                    .Select(s => new
                                                    {
                                                        s.f.Id,
                                                        s.f.Rating,
                                                        s.f.Description,
                                                        Name = s.u.FirstName+" "+s.u.LastName,
                                                        s.u.Email,
                                                       
                                                    });
                return Request.CreateResponse(HttpStatusCode.OK, list);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public object GetRating(int id)
        {
            try
            {
                var rating = db.FeedBacks.Where(w => w.H_Id == id).GroupBy(g => g.Rating).Select(s => new
                {
                    s.Key,
                    Total = s.Count()
                });
                var total = 0.0;
                var sum = 0.0;
                var One_Star = 0;
                var Two_Star = 0;
                var Three_Star = 0;
                var Four_Star = 0;
                var Five_Star = 0;
                var TotalRatingCount = 0.0;
                var TotalReviews = 0.0;
                var AverageRating = 0.0;
                foreach (var item in rating)
                {
                    if (item.Key == 1.0 || item.Key == 1)
                        One_Star = item.Total;
                    else if (item.Key == 2.0 || item.Key == 2)
                        Two_Star = item.Total;
                    else if (item.Key == 3.0 || item.Key == 3)
                        Three_Star = item.Total;
                    else if (item.Key == 4.0 || item.Key == 4)
                        Four_Star = item.Total;
                    else if (item.Key == 5.0 || item.Key == 5)
                        Five_Star = item.Total;
                    var total_reviews_in_one_group = Convert.ToDouble(item.Total);// i.e 15 people give 5 star
                    var rating_value_of_group = Convert.ToDouble(item.Key); // i.e for 5 star value is 5
                    TotalRatingCount += rating_value_of_group * total_reviews_in_one_group; // i.e 5 * 15
                    // add each group total reviews
                    // i.e
                    //  5 peoples  gives 5 star
                    //  4 peoples  gives 3 star
                    //  0 peoples  gives 1 star and so on....
                    // sum = 5+4+0
                    TotalReviews += total_reviews_in_one_group;
                }
                var obj = new
                {
                    //Lst = rating,
                    One_Star,
                    Two_Star,
                    Three_Star,
                    Four_Star,
                    Five_Star,
                    TotalRatingCount,
                    TotalReviews,
                    AverageRating = TotalReviews == 0 ? 0.0 : Math.Round(TotalRatingCount / TotalReviews, 1),
                };
                return obj;
            }
            catch (Exception ex)
            {
                return new { };
            }
        }

        [HttpGet]
        // getting user specific hostel that is booked by him
        public HttpResponseMessage MyHostels(int user_id)
        {
            try
            {
                var requestList = db.BookingRequests.Join(db.Hostels,
                                                     r => r.H_Id,
                                                     h => h.Id,
                                                     (r, h) => new { RequestInfo = r, HostelInfo = h }
                                                   ).Where(w => w.RequestInfo.User_Id == user_id && w.RequestInfo.Status != "Checkout"
                                                   ).Select(s => new
                                                   {
                                                       s.RequestInfo.Id,
                                                       //s.RequestInfo.BookingDate,
    
                                                       s.RequestInfo.H_Id,
                                                       s.RequestInfo.R_Id,
                                                       s.RequestInfo.Status,
                                                       s.RequestInfo,
                                                       s.HostelInfo,
                                                       HostelImages = db.Hostel_Images.Where(w => w.H_Id == s.HostelInfo.Id).Select(ss => ss.Image),
                                                       isFavorite = db.FavoriteHostels.Any(a => a.User_Id == user_id && a.H_Id == s.HostelInfo.Id)
                                                   }) ;
                var groups = requestList.GroupBy(g => g.H_Id);
                List<dynamic> list = new List<dynamic>();
                foreach (var group in groups)
                {
                    Console.WriteLine("List with ID == {0}", group.Key);
                    List<dynamic> roomList = new List<dynamic>();
                    foreach (var item in group)
                    {
                        var roominfo = db.Hostel_Rooms.FirstOrDefault(w => w.Id == item.R_Id);
                        var roomObj = new {
                            group.FirstOrDefault().RequestInfo.RoomType,
                            group.FirstOrDefault().RequestInfo.NoOfBeds,
                            group.FirstOrDefault().RequestInfo.R_Id,
                            group.FirstOrDefault().RequestInfo.BookingDate,
                            roominfo.Price
                        };

                        roomList.Add(roomObj);
                    }
                    var obj = new {
                        group.FirstOrDefault().Id,
                        group.FirstOrDefault().H_Id,
                        group.FirstOrDefault().Status,
                        group.FirstOrDefault().HostelInfo,
                        group.FirstOrDefault().isFavorite,
                    group.FirstOrDefault().HostelImages,
                    RoomInfo = roomList,
                    
                    };
                    list.Add(obj);  
                }

                return Request.CreateResponse(HttpStatusCode.OK, list);
              }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        // getting user specific hostel that he currently live
        public HttpResponseMessage UserApprovedHostels(int user_id)
        {
            try
            {
                var requestList = db.BookingRequests.Join(db.Hostels,
                                                     r => r.H_Id,
                                                     h => h.Id,
                                                     (r, h) => new { RequestInfo = r, HostelInfo = h }
                                                   ).Where(w => w.RequestInfo.User_Id == user_id && w.RequestInfo.Status == "Approved"
                                                   ).Select(s => new
                                                   {
                                                       s.RequestInfo.Id,
                                                       //s.RequestInfo.BookingDate,

                                                       s.RequestInfo.H_Id,
                                                       s.RequestInfo.R_Id,
                                                       s.RequestInfo.Status,
                                                       s.RequestInfo,
                                                       s.HostelInfo,
                                                       HostelImages = db.Hostel_Images.Where(w => w.H_Id == s.HostelInfo.Id).Select(ss => ss.Image),
                                                       isFavorite = db.FavoriteHostels.Any(a => a.User_Id == user_id && a.H_Id == s.HostelInfo.Id)
                                                   });
                var groups = requestList.GroupBy(g => g.H_Id);
                List<dynamic> list = new List<dynamic>();
                foreach (var group in groups)
                {
                    Console.WriteLine("List with ID == {0}", group.Key);
                    List<dynamic> roomList = new List<dynamic>();
                    foreach (var item in group)
                    {
                        var roominfo = db.Hostel_Rooms.FirstOrDefault(w => w.Id == item.R_Id);
                        var roomObj = new
                        {
                            /* group.FirstOrDefault().RequestInfo.RoomType,
                             group.FirstOrDefault().RequestInfo.NoOfBeds,
                             group.FirstOrDefault().RequestInfo.R_Id,
                             group.FirstOrDefault().RequestInfo.BookingDate,*/
                            roominfo.RoomType,
                            item.RequestInfo.NoOfBeds,
                            item.RequestInfo.R_Id,
                            item.RequestInfo.BookingDate,
                            roominfo.Price
                        };

                        roomList.Add(roomObj);
                    }
                    var obj = new
                    {
                        group.FirstOrDefault().Id,
                        group.FirstOrDefault().H_Id,
                        group.FirstOrDefault().Status,
                        group.FirstOrDefault().HostelInfo,
                        group.FirstOrDefault().isFavorite,
                        group.FirstOrDefault().HostelImages,
                        RoomInfo = roomList,

                    };
                    list.Add(obj);
                }

                return Request.CreateResponse(HttpStatusCode.OK, list);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpGet]
        // getting user specific hostel that he request for booking and currently its status is pending
        public HttpResponseMessage UserPendingHostels(int user_id)
        {
            try
            {
                var requestList = db.BookingRequests.Join(db.Hostels,
                                                     r => r.H_Id,
                                                     h => h.Id,
                                                     (r, h) => new { RequestInfo = r, HostelInfo = h }
                                                   ).Where(w => w.RequestInfo.User_Id == user_id && w.RequestInfo.Status == "Pending"
                                                   ).Select(s => new
                                                   {
                                                       s.RequestInfo.Id,
                                                       //s.RequestInfo.BookingDate,

                                                       s.RequestInfo.H_Id,
                                                       s.RequestInfo.R_Id,
                                                       s.RequestInfo.Status,
                                                       s.RequestInfo,
                                                       s.HostelInfo,
                                                       HostelImages = db.Hostel_Images.Where(w => w.H_Id == s.HostelInfo.Id).Select(ss => ss.Image),
                                                       isFavorite = db.FavoriteHostels.Any(a => a.User_Id == user_id && a.H_Id == s.HostelInfo.Id)
                                                   });
                var groups = requestList.GroupBy(g => g.H_Id);
                List<dynamic> list = new List<dynamic>();
                foreach (var group in groups)
                {
                    Console.WriteLine("List with ID == {0}", group.Key);
                    List<dynamic> roomList = new List<dynamic>();
                    foreach (var item in group)
                    {
                        var roominfo = db.Hostel_Rooms.FirstOrDefault(w => w.Id == item.R_Id);
                        var roomObj = new
                        {
                            group.FirstOrDefault().RequestInfo.RoomType,
                            group.FirstOrDefault().RequestInfo.NoOfBeds,
                            group.FirstOrDefault().RequestInfo.R_Id,
                            group.FirstOrDefault().RequestInfo.BookingDate,
                            roominfo.Price
                        };

                        roomList.Add(roomObj);
                    }
                    var obj = new
                    {
                        group.FirstOrDefault().Id,
                        group.FirstOrDefault().H_Id,
                        group.FirstOrDefault().Status,
                        group.FirstOrDefault().HostelInfo,
                        group.FirstOrDefault().isFavorite,
                        group.FirstOrDefault().HostelImages,
                        RoomInfo = roomList,

                    };
                    list.Add(obj);
                }

                return Request.CreateResponse(HttpStatusCode.OK, list);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }



        [HttpGet]
        public HttpResponseMessage Checkout(int user_id,int hostel_id)
        {
            try
            {
                using (var db = new Hostel_Management_SystemEntities())
                {

                var found = db.BookingRequests.Where(f => f.User_Id == user_id && f.H_Id==hostel_id).ToList();
                    found.ForEach(item =>
                    {
                        item.CheckoutDate = DateTime.Today;
                        item.Status = "Checkout";
                    });
                     db.SaveChanges();
                }

                var responseObj = new
                {
                    success = true,
                    message = "Checkout Successfully",
                    H_Id = hostel_id,
                };
                return Request.CreateResponse(HttpStatusCode.OK, responseObj);
                /* if (found.Count()==0)
                 {
                     var responseObj = new
                     {
                         success = false,
                         message = "No Record Found",
                     };
                     return Request.CreateResponse(HttpStatusCode.OK, responseObj);
                 }
                 else
                 {

                     using (var db = new Hostel_Management_SystemEntities())
                     {

                         found.ForEach(item =>
                         {
                             item.CheckoutDate = DateTime.Today;
                             item.Status = "Checkout";                         
                         db.SaveChanges();
                         }
                                     );
                     }

                     var responseObj = new
                     {
                         success = true,
                         message = "Checkout Successfully",
                         data = found,
                     };
                     return Request.CreateResponse(HttpStatusCode.OK, responseObj);
                 }*/
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        /* [HttpGet]
         public HttpResponseMessage Checkout(int requestId)
         {
             try
             {
                 var found = db.BookingRequests.FirstOrDefault(f => f.Id == requestId);
                 if (found == null)
                 {
                     var responseObj = new
                     {
                         success=false,
                         message="No Record Found",
                     };
                     return Request.CreateResponse(HttpStatusCode.OK, responseObj);
                 }
                 else
                 {
                     found.CheckoutDate =DateTime.Today;
                     found.Status = "Checkout";
                     db.SaveChanges();
                     var responseObj = new
                     {
                         success = true,
                         message = "Checkout Successfully",
                         data  = found,
                     };
                     return Request.CreateResponse(HttpStatusCode.OK, responseObj);
                 }
             }
             catch (Exception ex)
             {
                 return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
             }
         }
 */

        [HttpPost]
        public HttpResponseMessage AddFavorite(FavoriteHostel favorite)
        {
            try
            {
                db.FavoriteHostels.Add(favorite);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Hostel Added to Favorite Successfully!");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage RemoveFavorite(int userid,int hostelid)
        {
            try
            {
                var record = db.FavoriteHostels.FirstOrDefault(f => f.User_Id== userid && f.H_Id==hostelid);
                if (record == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "No Record Found.");
                }
                else
                {
                    db.FavoriteHostels.Remove(record);
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Hostel Removed from Favorite Successfully!");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetFavoriteHostels(int userid)
        {
            try
            {
                var list = db.FavoriteHostels.Join(db.Hostels,
                                             f=>f.H_Id,
                                             h=>h.Id,
                                             (f,h)=>new {f,h}
                                             ).Where(w => w.f.User_Id == userid).AsEnumerable()
                                            .Select(s => new
                                            {

                                                Hostel = new
                                                {
                                                    s.h.Id,s.h.HostelName,s.h.PhoneNo,s.h.Floor,s.h.Facilites,s.h.City,s.h.Address,s.h.Image,
                                                    s.h.Latitude,s.h.Longitude,s.h.Status,s.h.User_Id,s.h.Gender,
                                                    MinPrice = db.Hostel_Rooms.Where(w => w.H_Id == s.h.Id).Min(m => m.Price),
                                                    MaxPrice = db.Hostel_Rooms.Where(w => w.H_Id == s.h.Id).Max(m => m.Price),
                                                    TotalRooms = db.Hostel_Rooms.Where(w => w.H_Id == s.h.Id).Sum(sm => sm.TotalRooms),//total rooms in hostel
                                                    TotalBookedRooms = db.BookingRequests.Where(w => w.H_Id == s.h.Id && w.Status == "Approved").Sum(sm => sm.NoOfBeds) //total booked rooms in hostel
                                                },
                                                isFavorite = db.FavoriteHostels.Any(a => a.User_Id == userid && a.H_Id == s.h.Id),
                                                HostelImages = db.Hostel_Images.Where(w => w.H_Id == s.h.Id).Select(ss => ss.Image),
                                                RoomsList = db.Hostel_Rooms.Where(w => w.H_Id == s.h.Id)
                                                                           .Select(room => new
                                                                           {
                                                                               Id = room.Id,
                                                                               RoomType = room.RoomType,
                                                                               Price = room.Price,
                                                                               Facilites = room.Facilites,
                                                                               Description = room.Description,
                                                                               H_Id = room.H_Id,
                                                                               TotalRooms = room.TotalRooms,
                                                                               TotalBeds = room.TotalRooms * room.BedsInRoom,
                                                                               BedsInRoom = room.BedsInRoom,//total no of beds in one room
                                                                               BookedBeds = db.BookingRequests.Where(w => w.H_Id == s.h.Id && w.Status == "Approved" && w.RoomType == room.RoomType)
                                                                           .GroupBy(g => g.RoomType)
                                                                           .Select(r => r.Sum(c => c.NoOfBeds)).FirstOrDefault()
                                                                           }).ToList(),
                                                Rating = GetRating(s.h.Id),//calling self created method for rating

                                                /*
                     Users = db.BookingRequests.Join(db.Users, //all users detail who correctly live in this hostel
                          r => r.User_Id,
                          u => u.Id,
                          (r, u) => new { RequestInfo = r, UserInfo = u }
                        ).Where(w => w.RequestInfo.Status == "Approved" && w.RequestInfo.H_Id == s.h.Id
                        ).Select(u => new
                        {
                            Name = u.UserInfo.FirstName + " " + u.UserInfo.LastName,
                            u.UserInfo.Email,
                            u.UserInfo.CNIC,
                            u.UserInfo.PhoneNo,
                            u.UserInfo.Occupation,
                            u.UserInfo.Reg_No,
                            u.UserInfo.InstitudeName,
                            u.RequestInfo.BookingDate,
                            u.RequestInfo.CheckoutDate,
                            u.RequestInfo.RoomType,
                            u.RequestInfo.NoOfBeds,
                        })
        */
                                            }).ToList(); ;
                return Request.CreateResponse(HttpStatusCode.OK,list);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

    }
}
