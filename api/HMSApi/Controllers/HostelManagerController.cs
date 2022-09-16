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
                var check = db.Hostel_Rooms.FirstOrDefault(f => f.RoomType == hostel_Rooms.RoomType && f.H_Id == hostel_Rooms.H_Id);
                if (check != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }
                else
                {
                db.Hostel_Rooms.Add(hostel_Rooms);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK,true);
                }
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
                var Facilities = HttpContext.Current.Request.Form["Facilities"];
                var City = HttpContext.Current.Request.Form["City"];
                var Address = HttpContext.Current.Request.Form["Address"];
               // var ImageName = HttpContext.Current.Request.Form["Image"];
                var Latitude = HttpContext.Current.Request.Form["Latitude"];
                var Longitude = HttpContext.Current.Request.Form["Longitude"];
                var User_Id = HttpContext.Current.Request.Form["User_Id"];
                var Gender = HttpContext.Current.Request.Form["Gender"];

                Hostel hostel = new Hostel();
                hostel.HostelName = HostelName;
                hostel.PhoneNo = PhoneNo;
                hostel.Floor = Floor;
                hostel.Facilites = Facilities;
                hostel.City = City;
                hostel.Address = Address;
                hostel.Gender = Gender;
                if (Latitude!=null || Longitude != null)
                {
                  hostel.Latitude = float.Parse(Latitude);
                  hostel.Longitude = float.Parse(Longitude);
                }
                hostel.Status = "Pending";
                if (User_Id != null)
                {
                hostel.User_Id = int.Parse(User_Id);
                }

                List<dynamic> imagesNameList = new List<dynamic>();
                //Getting image detail i.e ContentType ,ContentLength,FileName etc.
                var file = HttpContext.Current.Request.Files.Count > 0 ? HttpContext.Current.Request.Files[0] : null;
                    if (file != null && file.ContentLength > 0)
                    {
/*                        BinaryReader br = new BinaryReader(file.InputStream);
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
                        hostel.Image = imageName;*/
                   
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        BinaryReader br = new BinaryReader(HttpContext.Current.Request.Files[i].InputStream);
                        //Convetring image into binary
                        var Image = Convert.ToBase64String(br.ReadBytes(HttpContext.Current.Request.Files[i].ContentLength));
                        var ImageType = HttpContext.Current.Request.Files[i].ContentType;
                        //Upload image in server folder

                        //storing fileName i.e pakistan.jpg
                        // var imageName = Path.GetFileName(file.FileName); //gettting orignal file name
                        var imageName = string.Format(@"{0}{1}", Guid.NewGuid(), Path.GetExtension(HttpContext.Current.Request.Files[i].FileName));//getting unique filename

                        //String filePath i.e E:\React Native Workspace\UploadImage\UploadImage\uploads\pakistan.jpg
                        var imagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), imageName);
                        HttpContext.Current.Request.Files[i].SaveAs(imagePath);
                        //hostel.Image = imageName;
                        imagesNameList.Add(imageName);
                    }

                }
                var insertedRecord = db.Hostels.Add(hostel);
                db.SaveChanges();
                foreach (var item in imagesNameList)
                {
                    Hostel_Images himages = new Hostel_Images();
                    himages.Image = item;
                    himages.H_Id = insertedRecord.Id;
                    db.Hostel_Images.Add(himages);
                }
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    Id = insertedRecord.Id,
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError ,ex.Message);
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
        public HttpResponseMessage GetPendingHostels(int user_id)
        {
            try
            {
                /*     var hostelsList = db.Hostels.Where(s => s.Status == "Pending" && s.User_Id==user_id)
                                                 .Select(s => new
                                                 {
                                                     Hostel = s,
                                                     RoomsList = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).ToList(),
                                                 }).ToList();*/

                var hostelsList = db.Hostels.Where(s => s.Status == "Pending" && s.User_Id == user_id).AsEnumerable()
                                          .Select(s => new
                                          {
                                              Hostel = new
                                              {
                                                  s.Id,
                                                  s.HostelName,
                                                  s.PhoneNo,
                                                  s.Floor,
                                                  s.Facilites,
                                                  s.City,
                                                  s.Address,
                                                  s.Image,
                                                  s.Latitude,
                                                  s.Longitude,
                                                  s.Status,
                                                  s.User_Id,
                                                  s.Gender,
                                                  MinPrice = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).Min(m => m.Price),
                                                  MaxPrice = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).Max(m => m.Price),
                                                  TotalRooms = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).Sum(sm => sm.TotalRooms),//total rooms in hostel
                                                  TotalBookedRooms = db.BookingRequests.Where(w => w.H_Id == s.Id && w.Status == "Approved").Sum(sm => sm.NoOfBeds) //total booked rooms in hostel
                                              },
                                              HostelImages = db.Hostel_Images.Where(w => w.H_Id == s.Id).Select(ss => ss.Image),
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
                                                                             BookedBeds = db.BookingRequests.Where(w => w.H_Id == s.Id && w.Status == "Approved" && w.RoomType == room.RoomType)
                                                                         .GroupBy(g => g.RoomType)
                                                                         .Select(r => r.Sum(c => c.NoOfBeds)).FirstOrDefault()
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
        public HttpResponseMessage GetApprovedHostels(int user_id)
        {
            try
            {
                /* var hostelsList = db.Hostels.Where(s => s.Status == "Approved" && s.User_Id == user_id)
                                             .Select(s => new
                                             {
                                                 Hostel = s,
                                                 RoomsList = db.Hostel_Rooms.Where(w=>w.H_Id==s.Id).ToList(),
                                             }).ToList();*/

                var hostelsList = db.Hostels.Where(s => s.Status == "Approved" && s.User_Id == user_id).AsEnumerable()
                                          .Select(s => new
                                          {
                                              Hostel = new
                                              {
                                                  s.Id,
                                                  s.HostelName,
                                                  s.PhoneNo,
                                                  s.Floor,
                                                  s.Facilites,
                                                  s.City,
                                                  s.Address,
                                                  s.Image,
                                                  s.Latitude,
                                                  s.Longitude,
                                                  s.Status,
                                                  s.User_Id,
                                                  s.Gender,
                                                  MinPrice = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).Min(m => m.Price),
                                                  MaxPrice = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).Max(m => m.Price),
                                                  TotalRooms = db.Hostel_Rooms.Where(w => w.H_Id == s.Id).Sum(sm => sm.TotalRooms),//total rooms in hostel
                                                    TotalBookedRooms = db.BookingRequests.Where(w => w.H_Id == s.Id && w.Status == "Approved").Sum(sm => sm.NoOfBeds) //total booked rooms in hostel
                                                },
                                              HostelImages = db.Hostel_Images.Where(w => w.H_Id == s.Id).Select(ss => ss.Image),
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
                                                                               BookedBeds = db.BookingRequests.Where(w => w.H_Id == s.Id && w.Status == "Approved" && w.RoomType == room.RoomType)
                                                                         .GroupBy(g => g.RoomType)
                                                                         .Select(r => r.Sum(c => c.NoOfBeds)).FirstOrDefault()
                                                                         }).ToList(),
                                              Rating = GetRating(s.Id),//calling seld created method for rating
                                              Users = db.BookingRequests.Join(db.Users, //all users detail who correctly live in this hostel
                                                     r => r.User_Id,
                                                     u => u.Id,
                                                     (r, u) => new { RequestInfo = r, UserInfo = u }
                                                   ).Where(w => w.RequestInfo.Status == "Approved" && w.RequestInfo.H_Id == s.Id
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
                                                       s.RequestInfo.NoOfBeds,
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

        
        //-------------------------------------------Edit and Delete Room------------------------------------

        [HttpGet]
        public HttpResponseMessage GetRoomDetail(int room_id)
        {
            try
            {
                var data = db.Hostel_Rooms.FirstOrDefault(f => f.Id == room_id);
                if (data == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, data);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public HttpResponseMessage UpdateRoom(Hostel_Rooms hostel_Rooms)
        {
            try
            {
                var data = db.Hostel_Rooms.FirstOrDefault(f => f.Id == hostel_Rooms.Id);
                if (data == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }
                else
                {
                    data.RoomType = hostel_Rooms.RoomType;
                    data.TotalRooms = hostel_Rooms.TotalRooms;
                    data.Price = hostel_Rooms.Price;
                    data.Facilites=hostel_Rooms.Facilites;
                    data.Description = hostel_Rooms.Description;
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Room Updated successfully!");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage DeleteRoom(int room_id)
        {
            try
            {
                var data = db.Hostel_Rooms.FirstOrDefault(f => f.Id == room_id);
                if (data == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }
                else
                {
                    db.Hostel_Rooms.Remove(data);
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, true);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        //-------------------------------------------Edit and Delete Hostel------------------------------------

        [HttpGet]
        public HttpResponseMessage GetHostelDetail(int id)
        {
            try
            {
                var data = db.Hostels.FirstOrDefault(f => f.Id == id);
                if (data == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }
                else
                {
                    var obj = new
                    {
                        HostelInfo = data,
                        HostelImages = db.Hostel_Images.Where(w => w.H_Id == id).ToList()
                    };
                    return Request.CreateResponse(HttpStatusCode.OK, obj);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public HttpResponseMessage UpdateHostel()
        {
            try
            {
                var Id = HttpContext.Current.Request.Form["Id"];
                var HostelName = HttpContext.Current.Request.Form["HostelName"];
                var PhoneNo = HttpContext.Current.Request.Form["PhoneNo"];
                var Floor = HttpContext.Current.Request.Form["Floor"];
                var Facilities = HttpContext.Current.Request.Form["Facilities"];
                var City = HttpContext.Current.Request.Form["City"];
                var Address = HttpContext.Current.Request.Form["Address"];
                // var ImageName = HttpContext.Current.Request.Form["Image"];
                var Latitude = HttpContext.Current.Request.Form["Latitude"];
                var Longitude = HttpContext.Current.Request.Form["Longitude"];
                var User_Id = HttpContext.Current.Request.Form["User_Id"];
                var Gender = HttpContext.Current.Request.Form["Gender"];

                int hostelid = int.Parse(Id);
                var data = db.Hostels.FirstOrDefault(f => f.Id ==hostelid);
                if (data == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }
                else
                {
                    data.HostelName = HostelName;
                    data.PhoneNo = PhoneNo;
                    data.Floor = Floor;
                    data.Facilites = Facilities;
                    data.City = City;
                    data.Address = Address;
                    data.Gender = Gender;
                    if (Latitude != null || Longitude != null)
                    {
                        data.Latitude = float.Parse(Latitude);
                        data.Longitude = float.Parse(Longitude);
                    }
                    //data.Status = "Pending";
                 /*   if (User_Id != null)
                    {
                        data.User_Id = int.Parse(User_Id);
                    }*/

                    List<dynamic> imagesNameList = new List<dynamic>();
                    var file = HttpContext.Current.Request.Files.Count > 0 ? HttpContext.Current.Request.Files[0] : null;
                    if (file != null && file.ContentLength > 0)
                    {
                        for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                        {
                            BinaryReader br = new BinaryReader(HttpContext.Current.Request.Files[i].InputStream);
                            //Convetring image into binary
                            var Image = Convert.ToBase64String(br.ReadBytes(HttpContext.Current.Request.Files[i].ContentLength));
                            var ImageType = HttpContext.Current.Request.Files[i].ContentType;
                            var imageName = string.Format(@"{0}{1}", Guid.NewGuid(), Path.GetExtension(HttpContext.Current.Request.Files[i].FileName));//getting unique filename
                            var imagePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), imageName);
                            HttpContext.Current.Request.Files[i].SaveAs(imagePath);
                            imagesNameList.Add(imageName);
                        }
                    }
                   // var insertedRecord = db.Hostels.Add(hostel);
                    db.SaveChanges();
                    foreach (var item in imagesNameList)
                    {
                        Hostel_Images himages = new Hostel_Images();
                        himages.Image = item;
                        himages.H_Id = hostelid;
                        db.Hostel_Images.Add(himages);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Hostel Updated successfully!");
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage DeleteHostel(int id)
        {
            try
            {
                var data = db.Hostels.FirstOrDefault(f => f.Id == id);
                if (data == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }
                else
                {
                    db.Hostels.Remove(data);
                    var images = db.Hostel_Images.Where(w => w.H_Id == id);
                    db.Hostel_Images.RemoveRange(images);
                    var rooms = db.Hostel_Rooms.Where(w => w.H_Id == id);
                    db.Hostel_Rooms.RemoveRange(rooms);
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, true);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage DeleteHostelImage(int id)
        {
            try
            {
                var data = db.Hostel_Images.FirstOrDefault(f => f.Id == id);
                if (data == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, false);
                }
                else
                {
                    db.Hostel_Images.Remove(data);
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, true);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

    }
}
