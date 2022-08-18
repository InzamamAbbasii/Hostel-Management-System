﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HMSApi.Models;
namespace HMSApi.Controllers
{
    public class AdminController : ApiController
    {
        Hostel_Management_SystemEntities db =  new Hostel_Management_SystemEntities();

        [HttpGet]
        public HttpResponseMessage Get_NewHostels_Request(int id)
        {
            try
            {
                var hostelsList = db.Hostels.Where(s => s.Status=="Pending" && s.User_Id==id)
                                            .Select(s => new
                                            {
                                                Hostel = s,
                                                RoomsList = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).ToList(),
                                            }).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, hostelsList);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        //Getting all approved hostels 
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
                    if(item.Key==1.0 || item.Key == 1)
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
                    TotalReviews +=  total_reviews_in_one_group; 
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
                          AverageRating =TotalReviews==0?0.0:Math.Round(TotalRatingCount / TotalReviews, 1),
                    };
                    return obj;
            }
            catch (Exception ex)
            {
                return new {};
            }
        }

        [HttpGet]
        //Getting all approved hostels 
        public HttpResponseMessage GetHostels()
        {
            try
            {
                var hostelsList = db.Hostels.Where(s => s.Status == "Approved").AsEnumerable()
                                            .Select(s => new
                                            {
                                                Hostel = new
                                                {   s.Id,s.HostelName,s.PhoneNo,s.Floor,s.City,s.Address,s.Image,
                                                    s.Latitude,s.Longitude,s.Status,s.User_Id,s.Gender,
                                                    MinPrice = db.Hostel_Rooms.Where(w=>w.H_Id==s.Id).Min(m=>m.Price),
                                                    MaxPrice = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).Max(m => m.Price),
                                                    TotalRooms = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).Sum(sm => sm.TotalRooms),//total rooms in hostel
                                                    TotalBookedRooms = db.BookingRequests.Where(w => w.H_Id == s.Id && w.Status == "Approved").Sum(sm => sm.NoOfBeds) //total booked rooms in hostel
                                                },
                                                RoomsList = db.Hostel_Rooms.Where(w => w.H_Id == s.Id)
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
                                                                               BookedBeds = db.BookingRequests.Where(w => w.H_Id == s.Id && w.Status == "Approved" && w.RoomType==room.RoomType)
                                                                           .GroupBy(g => g.RoomType)
                                                                           .Select(r => r.Sum(c=>c.NoOfBeds)).FirstOrDefault()
                                                                           }).ToList(),
                                                Rating = GetRating(s.Id),//calling seld created method for rating
                                               
                                            }).ToList();

                return Request.CreateResponse(HttpStatusCode.OK, hostelsList);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage ApproveHostel(int id) //id=hostel id
        {
            try
            {
                var check = db.Hostels.FirstOrDefault(h=>h.Id==id);
                if (check == null)
                {
                    var obj = new
                    {
                        success = false,
                        message = "No Record Found",
                        data = check
                    };
                    return Request.CreateResponse(HttpStatusCode.OK, obj);
                }
                else
                {
                    check.Status = "Approved";
                    db.SaveChanges();
                    var obj = new
                    {
                        success = true,
                        message = "Hostel Approved by admin",
                        data = check
                    };
                    return Request.CreateResponse(HttpStatusCode.OK,obj);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage RejectHostel(int id) //id=hostel id
        {
            try
            {
                var check = db.Hostels.FirstOrDefault(h => h.Id == id);
                if (check == null)
                {
                    var obj = new
                    {
                        success = false,
                        message = "No Record Found",
                        data = check
                    };
                    return Request.CreateResponse(HttpStatusCode.OK, obj);
                }
                else
                {
                    check.Status = "Rejected";
                    db.SaveChanges();
                    var obj = new
                    {
                        success = true,
                        message = "Hostel Rejected by admin",
                        data = check
                    };
                    return Request.CreateResponse(HttpStatusCode.OK, obj);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetHostelManagers()
        {
            try
            {
                var check = db.Users.Where(s => s.AccountType == "Hostel Manager").ToList();
                return Request.CreateResponse(HttpStatusCode.OK, check);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

    }
}
