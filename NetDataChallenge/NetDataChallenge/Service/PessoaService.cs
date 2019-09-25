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
                   }
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
                           Status = "finished"
                       },
                       new StatusModel()
                       {
                           Portal = "Google",
                           Status = "finished"
                       }
                   }
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
                   }
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
    }
}
