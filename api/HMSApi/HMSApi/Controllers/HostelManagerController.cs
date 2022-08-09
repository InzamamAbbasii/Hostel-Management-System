using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using HMSApi.Models;
namespace HMSApi.Controllers
{
    public class HostelManagerController : ApiController
    {
        Hostel_Management_SystemEntities db = new Hostel_Management_SystemEntities();

        [HttpPost]
        public HttpResponseMessage AddRoom(Hostel_Rooms hostel_Rooms)
        {
            try
            {
                db.Hostel_Rooms.Add(hostel_Rooms);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public HttpResponseMessage AddHostel()
        {
            try
            { 
                var HostelName = HttpContext.Current.Request.Form["HostelName"];
                var PhoneNo = HttpContext.Current.Request.Form["PhoneNo"];
                var Floor = HttpContext.Current.Request.Form["Floor"];
                var City = HttpContext.Current.Request.Form["City"];
                var Address = HttpContext.Current.Request.Form["Address"];
               // var ImageName = HttpContext.Current.Request.Form["Image"];
                var Latitude = HttpContext.Current.Request.Form["Latitude"];
                var Longitude = HttpContext.Current.Request.Form["Longitude"];
                var User_Id = HttpContext.Current.Request.Form["User_Id"];

                Hostel hostel = new Hostel();
                hostel.HostelName = HostelName;
                hostel.PhoneNo = PhoneNo;
                hostel.Floor = Floor;
                hostel.City = City;
                hostel.Address = Address;
                if(Latitude!=null || Longitude != null)
                {
                  hostel.Latitude = float.Parse(Latitude);
                  hostel.Longitude = float.Parse(Longitude);
                }
                hostel.Status = "Pending";
                if (User_Id != null)
                {
                hostel.User_Id = int.Parse(User_Id);
                }
              

                //Getting image detail i.e ContentType ,ContentLength,FileName etc.
                var file = HttpContext.Current.Request.Files.Count > 0 ? HttpContext.Current.Request.Files[0] : null;
                    if (file != null && file.ContentLength > 0)
                    {
                        BinaryReader br = new BinaryReader(file.InputStream);
                        //Convetring image into binary
                        var Image = Convert.ToBase64String(br.ReadBytes(file.ContentLength));
                        var ImageType = file.ContentType;
                        //Upload image in server folder

                        //storing fileName i.e pakistan.jpg
                        // var imageName = Path.GetFileName(file.FileName); //gettting orignal file name
                         var imageName = string.Format(@"{0}{1}", Guid.NewGuid(), Path.GetExtension(file.FileName));//getting unique filename

                        //String filePath i.e E:\React Native Workspace\UploadImage\UploadImage\uploads\pakistan.jpg
                        var imagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), imageName);
                        file.SaveAs(imagePath);
                        hostel.Image = imageName;
                    }
                var insertedRecord = db.Hostels.Add(hostel);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    Id = insertedRecord.Id,
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError +ex.Message);
            }

        }

        [HttpGet]
        public HttpResponseMessage GetPendingHostels(int user_id)
        {
            try
            {
                var hostelsList = db.Hostels.Where(s => s.Status == "Pending" && s.User_Id==user_id)
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
        public HttpResponseMessage GetApprovedHostels(int user_id)
        {
            try
            {
                var hostelsList = db.Hostels.Where(s => s.Status == "Approved" && s.User_Id == user_id)
                                            .Select(s => new
                                            {
                                                Hostel = s,
                                                RoomsList = db.Hostel_Rooms.Where(w=>w.H_Id==s.Id).ToList(),
                                            }).ToList();
                    
                return Request.CreateResponse(HttpStatusCode.OK, hostelsList);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetBookingRequest(int user_id)
        {
            try
            {
                var requestList = db.BookingRequests.Join(db.Hostels,
                                                      r => r.H_Id,
                                                      h => h.Id,
                                                      (r, h) => new { RequestInfo = r, HostelInfo = h }
                                                    ).Where(w => w.HostelInfo.User_Id == user_id && w.RequestInfo.Status=="Pending"
                                                    ).Select(s => new
                                                    {
                                                        s.HostelInfo,s.RequestInfo,
                                                        UserInfo = db.Users.FirstOrDefault(u=>u.Id==s.RequestInfo.User_Id)
                                                    }).Select(s=>new {
                                                       s.RequestInfo.Id,
                                                       s.RequestInfo.BookingDate,
                                                       s.RequestInfo.CheckoutDate,
                                                       s.RequestInfo.RoomType,
                                                       s.RequestInfo.NoOfRooms,
                                                       Name = s.UserInfo.FirstName+" "+s.UserInfo.LastName,
                                                       s.UserInfo.Email,
                                                       s.UserInfo.CNIC,
                                                       s.UserInfo.PhoneNo,
                                                       s.UserInfo.Occupation
                                                    });
                                                    

                return Request.CreateResponse(HttpStatusCode.OK, requestList);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage ApproveBooking(int id) //id=request id
        {
            try
            {
                var check = db.BookingRequests.FirstOrDefault(r => r.Id == id);
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
                        message = "Request Approved Successfully.",
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
        public HttpResponseMessage RejectBooking(int id) //id=request id
        {
            try
            {
                var check = db.BookingRequests.FirstOrDefault(r => r.Id == id);
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
                        message = "Rejected Successfully",
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
