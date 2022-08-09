using System;
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
        public HttpResponseMessage Get_NewHostels_Request()
        {
            try
            {
                var hostelsList = db.Hostels.Where(s => s.Status=="Pending")
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
        public HttpResponseMessage GetHostels()
        {
            try
            {
                var hostelsList = db.Hostels.Where(s => s.Status == "Approved")
                                            .Select(s => new
                                            {
                                                Hostel = s,
                                                RoomsList = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).ToList(),
                                                Rating = db.FeedBacks.Where(w => w.H_Id == s.Id).GroupBy(g => g.Rating)
                                                              .Select(r => r.Average(a => a.Rating)).FirstOrDefault(),
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

    }
}
