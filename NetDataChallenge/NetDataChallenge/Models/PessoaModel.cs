using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NetDataChallenge.Models
{
    public class PessoaModel
    {
        [Display(Name = "Nome:")]
        public string FirstName { get; set; }

        [Display(Name = "Sobrenome:")]
        public string LastName { get; set; }

        [Display(Name = "RG:")]
        public string Rg { get; set; }

        [Display(Name = "CPF:")]
        public string Cpf { get; set; }

        [Display(Name = "CNPJ:")]
        public string Cnpj { get; set; }

        [Display(Name = "Portais:")]
        public IList<string> Portals { get; set; }
        public string SearchPage { get; set; }
        public string UidCreated { get; set; }

        public string CreatedAt { get; set; }

        public string PersonId { get; set; }

        public IList<StatusModel> ListaStatus { get; set; }


    }
}
