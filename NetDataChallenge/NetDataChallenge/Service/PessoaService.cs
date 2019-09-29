using NetDataChallenge.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NetDataChallenge.Service
{
    public class PessoaService
    {
        private static IList<PessoaModel> pessoas = new List<PessoaModel>() {
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
        }
    }
}
