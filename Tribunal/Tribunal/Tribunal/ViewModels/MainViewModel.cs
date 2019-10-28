using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Windows.Input;
using Tribunal.Layers.Business;
using Tribunal.Layers.Service;
using Tribunal.Models;
using Tribunal.Views;
using Xamarin.Forms;

namespace Tribunal.ViewModels
{
    public class MainViewModel
    {

        #region Atributos
        //readonly Action<T> _execute = null;
        private PersonBusiness _personBusiness;
        private PersonModel _personSelected;
        private IList<PersonModel> _people;
        ObservableCollection<PersonModel> _pessoas;
        private bool _isRefreshing;
        private string _textoDigitado;

        #endregion

        #region Propriedades
        public PersonModel PersonSelected
        {
            get 
            { 
                return _personSelected; 
            }
            set 
            { 
                _personSelected = value; 
                NotifyPropertyChanged(); 
            }
        }
        public string TextoDigitado
        {
            get{
                return _textoDigitado;
            }
        
            set{
                if (_textoDigitado != value){
                    _textoDigitado = value;
                   
                }
                NotifyPropertyChanged();
            }
        }
        public IList<PersonModel> People
        {
            get 
            { 
                return _people; 
            }
            set
            { _people = value; 
                NotifyPropertyChanged(); 
            }
        }
        public bool IsRefreshing
        {
            get
            {
                return _isRefreshing;
            }
            set
            {
                if (_isRefreshing != value)
                {
                    _isRefreshing = value;
                }
                NotifyPropertyChanged();
            }
        }

        public ObservableCollection<PersonModel> Pessoas { get; set; }
        #endregion

        #region Comandos
        public ICommand ListViewClicked { get; set; }
        public ICommand SearchCommand{ get; set; }
        #endregion
        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void NotifyPropertyChanged([CallerMemberName] string propertyName = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
      
        public MainViewModel()
        {
            _personBusiness = new PersonBusiness();
            People = _personBusiness.GetPeople();

            

            ListViewClicked = new Command(() =>
            {
                Global.PersonSelected = PersonSelected;
                MessagingCenter.Send<PersonModel>(PersonSelected, "ShowDetail");
            });

            /* SearchBarTextChanged = new Command(() =>
            {
                People = (IList<PersonModel>)dataService.Buscar(TextoDigitado);

            });

             public ICommand RealizarBuscar => new Command<string>((string query) =>

             {

             });*/
            SearchCommand = new Command(() =>
           {
               IsRefreshing = true;

               if (string.IsNullOrEmpty(TextoDigitado))
               {
                   People = _personBusiness.GetPeople();
               }
               else
               {
                   Pessoas = new ObservableCollection<PersonModel>(People.Where(p => p.Name.ToLower().
                               Contains(TextoDigitado.ToLower())).
                               OrderBy(p => p.Name));
                   People = Pessoas;
                   NotifyPropertyChanged();
               }

               IsRefreshing = false;

             
           });

        }
        //public IList<PersonModel> Search()
        //{
        //    IsRefreshing = true;

        //    if(string.IsNullOrEmpty(TextoDigitado))
        //    {
        //        People = _personBusiness.GetPeople();
        //    }
        //    else
        //    {
        //        Pessoas = new ObservableCollection<PersonModel>(People.Where(p => p.Name.ToLower().
        //                    Contains(TextoDigitado.ToLower())).
        //                    OrderBy(p => p.Name));
        //        People = Pessoas;
        //        NotifyPropertyChanged();
        //    }
            
        //    IsRefreshing = false;

        //    return People;
        //}

        //public T RelayCommand(Action<T> execute, Predicate<T> canExecute)
        //{
        //    if (execute == null)
        //        throw new ArgumentNullException("execute");

        //    _execute = execute;
        //    _canExecute = canExecute;

        //    return T;
        //}


    }
}
