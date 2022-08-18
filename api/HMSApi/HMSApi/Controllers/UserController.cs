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

        [HttpGet]
        public HttpResponseMessage GetRating(int id) //id -> hostel id
        {
            try
            {
                var list = db.FeedBacks.Join(db.Users,
                                                      f => f.User_Id,
                                                      u => u.Id,
                                                      (f, u) => new { f, u }
                                                    ).Where(w => w.f.H_Id == id)
                                                    .Select(s => new
                                                    {
                                                        s.f.Id,
                                                        s.f.Rating,
                                                        s.f.Description,
                                                        Name = s.u.FirstName + " " + s.u.LastName,
                                                        s.u.Email,

                                                    });
                return Request.CreateResponse(HttpStatusCode.OK, list);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
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
                                                   ).Where(w => w.RequestInfo.User_Id == user_id && w.RequestInfo.Status!="Checkout"
                                                   ).Select(s => new
                                                   {
                                                       s.RequestInfo.Id,
                                                       //s.RequestInfo.BookingDate,
                                                       // s.RequestInfo.CheckoutDate,
                                                       s.RequestInfo.H_Id,
                                                       s.RequestInfo.Status,
                                                       s.HostelInfo,
                                                       RoomInfo = new
                                                       {
                                                           s.RequestInfo.RoomType,
                                                           s.RequestInfo.NoOfBeds,
                                                           s.RequestInfo.BookingDate,
                                                           s.RequestInfo.R_Id,
                                                           Price = db.Hostel_Rooms.FirstOrDefault(f => f.Id == s.RequestInfo.R_Id).Price
                                                       }

                                                   }) ;
                var unique = requestList.GroupBy(g => g.H_Id).Select(s=>s.FirstOrDefault());

                return Request.CreateResponse(HttpStatusCode.OK, unique);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
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
    }
}
