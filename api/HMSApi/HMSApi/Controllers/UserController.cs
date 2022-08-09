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

    }
}
