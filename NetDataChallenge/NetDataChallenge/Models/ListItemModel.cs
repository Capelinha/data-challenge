using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NetDataChallenge.Models
{
    public class ListItemModel
    {
        public int Number { get; set; }
        public string Name { get; set; }
        public double Progress { get; set; }
        public double Correct { get; set; }
        public bool Status { get; set; }
        public string Id { get; set; }
    }
}
