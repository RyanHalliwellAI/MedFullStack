using System;
using System.Collections.Generic;

namespace API.Models
{

    public class Users
    {
        //Adding all attributites and collections from SQL to be used in .net

        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<UserRoles> UserRole { get; set; }

    }
}
