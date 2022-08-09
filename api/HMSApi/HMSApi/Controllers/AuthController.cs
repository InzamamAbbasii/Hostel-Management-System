using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HMSApi.Models;
namespace HMSApi.Controllers
{
    public class AuthController : ApiController
    {
        Hostel_Management_SystemEntities db = new Hostel_Management_SystemEntities();
        [HttpGet]
        public HttpResponseMessage Login(string email,string pass)
        {
            try
            {
                var check = db.Users.FirstOrDefault(w => w.Email == email && w.Password == pass);
                if (check != null)
                {
                    var obj = new
                    {
                        success = true,
                        message= "Login Successfully",
                        data = check
                    };
                    return Request.CreateResponse(HttpStatusCode.OK, obj);
                }
                else
                {
                    var obj = new
                    {
                        success = false,
                        message= "Invalid password or username",
                        data = check
                    };
                    return Request.CreateResponse(HttpStatusCode.OK, obj );
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [HttpPost]
        public HttpResponseMessage Register(User user)
        {
            try
            {
                db.Users.Add(user);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetUsers()
        {
            try
            {
                var check = db.Users.Select(s => s).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, check);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }
    }
}
