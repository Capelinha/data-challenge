using NetDataChallenge.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace NetDataChallenge.Service
{
    public class PessoaService
    {
        public IList<PessoaModel> FindAll()
        {
            var people = new List<PessoaModel>();
            var uri = "https://n2v0i9br7l.execute-api.us-east-1.amazonaws.com/dev/person";
            System.Net.Http.HttpClient client = new HttpClient();
            var resposta = client.GetAsync(uri).Result;
            if (resposta.IsSuccessStatusCode)
            {
                var resultado = resposta.Content.ReadAsStringAsync().Result;
                people = JsonConvert.DeserializeObject<List<PessoaModel>>(resultado);
                return people;
            }
            else
            {
                throw new Exception("Pessoas não encontradas");
            }
        }

        public void Insert(PessoaModel pessoa)
        {
            var uri = "https://n2v0i9br7l.execute-api.us-east-1.amazonaws.com/dev/person";
            var conteudoJson = Newtonsoft.Json.JsonConvert.SerializeObject(pessoa);
            var conteudoJsonString = new StringContent(conteudoJson, Encoding.UTF8, "application/json");
            HttpClient client = new HttpClient();
            var resposta = client.PostAsync(uri, conteudoJsonString).Result;
            if (!resposta.IsSuccessStatusCode)
            {
                throw new Exception("Ocorreu um erro!");
            }
        }

        public PessoaModel FindById(string id)
        {
            var uri = String.Format("https://n2v0i9br7l.execute-api.us-east-1.amazonaws.com/dev/person/{0}", id);
            HttpClient client = new HttpClient();
            var resposta = client.GetAsync(uri).Result;
            if (resposta.IsSuccessStatusCode)
            {
                var resultado = resposta.Content.ReadAsStringAsync().Result;
                var person = JsonConvert.DeserializeObject<PessoaModel>(resultado);
                return person;
            }
            else
            {
                throw new Exception("Dados da pessoa não encontrados!");
            }
        }

        public PessoaModel FindReport(string id)
        {
            var uri = String.Format("https://n2v0i9br7l.execute-api.us-east-1.amazonaws.com/dev/person/{0}/report", id);
            HttpClient client = new HttpClient();
            var resposta = client.GetAsync(uri).Result;
            if (resposta.IsSuccessStatusCode)
            {
                var resultado = resposta.Content.ReadAsStringAsync().Result;
                var person = JsonConvert.DeserializeObject<PessoaModel>(resultado);
                return person;
            }
            else
            {
                throw new Exception("Dados da pessoa não encontrados!");
            }
        }

        /*private static IList<PessoaModel> pessoas = new List<PessoaModel>() {
               new PessoaModel(){
                   FirstName = "Mateus",
                   LastName = " de Oliveira Igreja",
                   ListaStatus = new List<StatusModel>(){
                       new StatusModel()
                       {
                           Portal = "Consulta Socio",
                           Status = "starting"
                       },
                       new StatusModel()
                       {
                           Portal = "Escavador",
                           Status = "error"
                       },
                       new StatusModel()
                       {
                           Portal = "Google",
                           Status = "finished"
                       }
                   },
                   PersonId = "1"
               },
               new PessoaModel(){
                   FirstName = "Caio",
                   LastName = " Laurenti Bianchini",
                   ListaStatus = new List<StatusModel>(){
                       new StatusModel()
                       {
                           Portal = "Consulta Socio",
                           Status = "finished"
                       },
                       new StatusModel()
                       {
                           Portal = "Escavador",
                           Status = "error"
                       },
                       new StatusModel()
                       {
                           Portal = "Google",
                           Status = "finished"
                       }
                   },
                   PersonId = "2"
               },
               new PessoaModel(){
                   FirstName = "Gabriel",
                   LastName = " Lourenço",
                   ListaStatus = new List<StatusModel>(){
                       new StatusModel()
                       {
                           Portal = "Consulta Socio",
                           Status = "starting"
                       },
                       new StatusModel()
                       {
                           Portal = "Escavador",
                           Status = "starting"
                       },
                       new StatusModel()
                       {
                           Portal = "Google",
                           Status = "starting"
                       }
                   },
                   PersonId = "3"
               }

        };
       
        public void Insert(PessoaModel pessoaModel)
        {
            pessoas.Add(pessoaModel);
            Console.WriteLine("inserido");
        }

        public IList<PessoaModel> FindAll()
        {
            return pessoas;
        }

        public PessoaModel FindById(string _id)
        {
            return pessoas.SingleOrDefault<PessoaModel>(p => p.PersonId == _id);
        }*/
    }
}
