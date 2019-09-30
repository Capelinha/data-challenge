using Newtonsoft.Json;
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
        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [Display(Name = "Sobrenome:")]
        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [Display(Name = "RG:")]
        [JsonProperty("rg")]
        public string Rg { get; set; }

        [Display(Name = "CPF:")]
        [JsonProperty("cpf")]
        public string Cpf { get; set; }

        [Display(Name = "CNPJ:")]
        [JsonProperty("cnpj")]
        public string Cnpj { get; set; }

        [Display(Name = "Portais:")]
        public IList<string> Portals { get; set; }

        [JsonProperty("searchPages")]
        public string SearchPage { get; set; }

        [JsonProperty("uidCreated")]
        public string UidCreated { get; set; }

        public string CreatedAt { get; set; }

        public string PersonId { get; set; }

        public IDictionary<string,string> Status { get; set; }

        public string ReportUrl { get; set; }


    }
}
