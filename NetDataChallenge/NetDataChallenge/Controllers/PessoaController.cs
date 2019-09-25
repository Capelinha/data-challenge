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

        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.Pessoas = pessoaService.FindAll();
            return View(new PessoaModel() {
                    UidCreated = "sfdgsfjksadlghkalhsdkgadçkAKJHDASDKF"
                });
        }

        [HttpPost]
        public IActionResult Search(PessoaModel pessoa)
        {
            ViewBag.Pessoas = pessoaService.FindAll();
            pessoaService.Insert(pessoa);
            return RedirectToAction("Index", "Pessoa");
        }
    }
}