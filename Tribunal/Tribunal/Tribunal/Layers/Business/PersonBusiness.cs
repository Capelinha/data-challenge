using System;
using System.Collections.Generic;
using System.Text;
using Tribunal.Layers.Service;

namespace Tribunal.Layers.Business
{
    public class PersonBusiness
    {
        public IList<PersonModel> GetPeople()
        {
            return new PersonService().GetPeople();
        }
    }
}
