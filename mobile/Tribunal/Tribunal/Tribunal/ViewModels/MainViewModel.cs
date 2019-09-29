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

        private IList<PersonModel> _people;

        public IList<PersonModel> People
        {
            get { return _people; }
            set { _people = value; NotifyPropertyChanged(); }
        }

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
        }
    }
}
