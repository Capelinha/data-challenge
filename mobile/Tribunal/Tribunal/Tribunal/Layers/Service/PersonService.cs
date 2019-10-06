using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Tribunal.Layers.Service
{
    public class PersonService
    {
        public IList<PersonModel> GetPeople()
        {
            var people = new List<PersonModel>();
            var uri = "https://dpv95yr5p2.execute-api.us-east-1.amazonaws.com/dev/person";
            System.Net.Http.HttpClient client = new HttpClient();
            var resposta = client.GetAsync(uri).Result;
            if (resposta.IsSuccessStatusCode)
            {
                var resultado = resposta.Content.ReadAsStringAsync().Result;
                people = JsonConvert.DeserializeObject<List<PersonModel>>(resultado);
                return people;
            }
            else
            {
                throw new Exception("Pessoas não encontradas");
            }
        }
    }
}
