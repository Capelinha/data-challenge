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
            var pessoas = pessoaService.FindAll().OrderByDescending(p=> p.CreatedAt);
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
                foreach (var stats in pessoa.Status.Keys)
                {
                    tot++;
                    if (pessoa.Status[stats].Equals("starting"))
                    {
                        item.Status = false;
                    }
                    else if (pessoa.Status[stats].Equals("finished"))
                    {
                        progress++;
                        correct++;
                    }
                    else if (pessoa.Status[stats].Equals("error"))
                    {
                        progress++;
                    }
                }
                item.Progress = Math.Round((progress / tot) * 100);
                item.Correct = Math.Round((correct / tot) * 100);
                item.Id = pessoa.PersonId;
                item.ReportUrl = pessoa.ReportUrl;
                listItems.Add(item);
            }
            return listItems;
        }

        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.Pessoas = makeList();
            return View(new PessoaModel());
        }

        [HttpPost]
        public IActionResult AddSearch(PessoaModel pessoa)
        {
            string search = "";
            foreach(var portal in pessoa.Portals)
            {
                if (portal.Equals("Arisp"))
                {
                    search = search + "A1";
                } else if (portal.Equals("Arpensp"))
                {
                    search = search + "A2";
                }
                else if (portal.Equals("Cadesp"))
                {
                    search = search + "C1";
                }
                else if (portal.Equals("Censec"))
                {
                    search = search + "C2";
                }
                else if (portal.Equals("Caged"))
                {
                    search = search + "C3";
                }
                else if (portal.Equals("Consulta Socio"))
                {
                    search = search + "C4";
                }
                else if (portal.Equals("Escavador"))
                {
                    search = search + "E1";
                }
                else if (portal.Equals("Google"))
                {
                    search = search + "G1";
                }
                else if (portal.Equals("Infocrim"))
                {
                    search = search + "I1";
                }
                else if (portal.Equals("Infoseg"))
                {
                    search = search + "I2";
                }
                else if (portal.Equals("Jucesp"))
                {
                    search = search + "J1";
                }
                else if (portal.Equals("Siel"))
                {
                    search = search + "S1";
                }
                else if (portal.Equals("Sivec"))
                {
                    search = search + "S2";
                }
            }
            pessoa.SearchPage = search;
            pessoa.UidCreated = "sfdgsfjksadlghkalhsdkgadçkAKJHDASDKF";
            pessoaService.Insert(pessoa);
            ViewBag.Pessoas = makeList();
            return RedirectToAction("Index", "Pessoa");
        }

        public IActionResult Detalhes(string id)
        {
            PessoaModel pessoa = pessoaService.FindById(id);
            return View(pessoa);
        }

        public IActionResult Relatorio(string id)
        {
            PessoaModel pessoa = pessoaService.FindById(id);
            if (pessoa.ReportUrl == null)
                pessoa = pessoaService.FindReport(id);
            return Redirect(pessoa.ReportUrl);
        }
    }
}