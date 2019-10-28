using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Tribunal.Layers.Service
{
    class DataService
    {
       
       
        public IEnumerable <PersonModel> Buscar(String pesquisa = null)
        {
            var personService = new PersonService();
            var person = personService.GetPeople();

            IList<PersonModel> listaResultado = new List<PersonModel>();
            //\*foreach (PersonModel p in person)
            /// {
            // if (pesquisa.Equals(p.FirstName))
            //{
            //    listaResultado = person;
            // }
            // }
            if (string.IsNullOrEmpty(pesquisa))
            {
                return listaResultado;
            }
            return listaResultado.Where(p => p.Name.StartsWith(pesquisa));
  
        }


    }
}
