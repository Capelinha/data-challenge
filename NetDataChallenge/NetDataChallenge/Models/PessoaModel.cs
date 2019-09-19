using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NetDataChallenge.Models
{
    public class PessoaModel
    {

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Rg { get; set; }

        public string Cpf { get; set; }

        public string Cnpj { get; set; }
        public string SearchPage { get; set; }
        public string UidCreated { get; set; }

        public string CreatedAt { get; set; }

        public string PersonId { get; set; }

        public IList<StatusModel> ListaStatus { get; set; }


    }
}
