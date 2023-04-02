using System.Data;

namespace API.Models
{
    public class UserRoles
    {
        //Adding all attributites and collections from SQL to be used in .net

        public int UserId { get; set; }
        public Users User { get; set; }

        public int RoleId { get; set; }
        public Roles Role { get; set; }
    }
}
