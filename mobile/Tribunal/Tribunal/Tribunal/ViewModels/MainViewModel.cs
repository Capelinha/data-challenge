using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;
using System.Windows.Input;
using Tribunal.Layers.Business;
using Tribunal.Models;
using Xamarin.Forms;

namespace Tribunal.ViewModels
{
    public class MainViewModel
    {

        private PersonBusiness _personBusiness;
        private PersonModel _personSelected;

        public PersonModel PersonSelected
        {
            get { return _personSelected; }
            set { _personSelected = value; NotifyPropertyChanged(); }
        }

        public ICommand ListViewClicked { get; set; }
        

        private ListView listaPrincipal;

        public ListView ListaPrincipal
        {
            get { return listaPrincipal; }
            set { listaPrincipal = value; }
        }

       

        private IList<PersonModel> _listaAux;

        public IList<PersonModel> ListaAux
        {
            get { return _listaAux; }
            set { _listaAux = value; NotifyPropertyChanged(); }
        }

        private IList<PersonModel> _people;

        public IList<PersonModel> People
        {
            get { return _people; }
            set { _people = value; NotifyPropertyChanged(); }
        }

        private string _textoDigitado;

        public string TextoDigitado
        {
            get { return _textoDigitado; }
            set
            {
               
                _textoDigitado = value;

                ListaAux = new List<PersonModel>();

                foreach (PersonModel p in People)
                {
                    if (p.FirstName.ToLower().Contains(TextoDigitado.ToLower()))
                    {

                        ListaAux.Add(p);
                        ListaPrincipal.ItemsSource = ListaAux;
                        

                    }
                    
                }
                
                NotifyPropertyChanged();
            }

        }

        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void NotifyPropertyChanged([CallerMemberName] string propertyName = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public MainViewModel()
        {
            ListaPrincipal = new ListView();
            
           

            _personBusiness = new PersonBusiness();
            People = _personBusiness.GetPeople();
            ListaAux = People;
            ListaPrincipal.ItemsSource = People;
            ListViewClicked = new Command(() =>
            {
                Global.PersonSelected = PersonSelected;
                MessagingCenter.Send<PersonModel>(PersonSelected, "ShowDetail");
               
            });
        }
    }
}
