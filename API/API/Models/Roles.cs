using System.Collections.Generic;

namespace API.Models
{
    public class Roles
    {
        //Adding all attributites and collections from SQL to be used in .net
        public int Id { get; set; }
        public string Name { get; set; }
        
        public ICollection<UserRoles> UserRole { get; set; }
    }
}
