using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NetDataChallenge.Models;
using NetDataChallenge.Service;

namespace NetDataChallenge.Controllers
{
    public class PessoaController : Controller
    {

        private readonly PessoaService pessoaService;

        public PessoaController()
        {
            pessoaService = new PessoaService();
        }

        //Função para gerar os itens da lista
        public IList<ListItemModel> makeList()
        {
            var pessoas = pessoaService.FindAll();
            IList<ListItemModel> listItems = new List<ListItemModel>();
            //cálculo das porcentagens dos items
            foreach (var pessoa in pessoas)
            {
                double correct = 0;
                double progress = 0;
                double tot = 0;
                var item = new ListItemModel();
                item.Name = pessoa.FirstName +" " + pessoa.LastName;
                item.Status = true;
                foreach (var stats in pessoa.ListaStatus)
                {
                    tot++;
                    if (stats.Status.Equals("starting"))
                    {
                        item.Status = false;
                    }
                    else if (stats.Status.Equals("finished"))
                    {
                        progress++;
                        correct++;
                    }
                    else if (stats.Status.Equals("error"))
                    {
                        progress++;
                    }
                }
                item.Progress = Math.Round((progress / tot) * 100);
                item.Correct = Math.Round((correct / tot) * 100);
                item.Id = "1";
                listItems.Add(item);
            }
            return listItems;
        }

        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.Pessoas = makeList();
            return View(new PessoaModel()
            {
                UidCreated = "sfdgsfjksadlghkalhsdkgadçkAKJHDASDKF"
            });
        }

        [HttpPost]
        public IActionResult AddSearch(PessoaModel pessoa)
        {
            pessoa.ListaStatus = new List<StatusModel>(){
                new StatusModel()
                {
                    Portal = "Consulta Socio",
                    Status = "error"
                },
                new StatusModel()
                {
                    Portal = "Escavador",
                    Status = "error"
                },
                new StatusModel()
                {
                    Portal = "Google",
                    Status = "error"
                }
            };
            string search = "";
            foreach(var portal in pessoa.Portals)
            {
                if (portal.Equals("Facebook"))
                {
                    search = search + "F1";
                } else if (portal.Equals("Linkedin"))
                {
                    search = search + "L1";
                }
            }
            pessoa.SearchPage = search;
            pessoaService.Insert(pessoa);
            ViewBag.Pessoas = makeList();
            return RedirectToAction("Index", "Pessoa");
        }

        public IActionResult Detalhes(string id)
        {
            PessoaModel pessoa = pessoaService.FindById(id);
            return View(pessoa);
        }
    }
}