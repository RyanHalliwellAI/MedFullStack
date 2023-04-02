using System.Collections.Generic;

namespace API.Models
{
    public class Roles
    {
        public int Id { get; set; }
        public string Name { get; set; }
        
        public ICollection<UserRoles> UserRole { get; set; }
    }
}
