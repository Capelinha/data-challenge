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
    public class DetailViewModel
    {
        private PersonModel _personSelected;
        private PersonBusiness _personBusiness;

        public PersonModel PersonSelected
        {
            get { return _personSelected; }
            set { _personSelected = value; NotifyPropertyChanged(); }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        protected virtual void NotifyPropertyChanged([CallerMemberName] string propertyName = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public ICommand ReportClicked { get; set; }

        public DetailViewModel()
        {
            PersonSelected = Global.PersonSelected;
            _personBusiness = new PersonBusiness();

            ReportClicked = new Command(() =>
            {
                if (PersonSelected.ReportUrl != null)
                {
                    Device.OpenUri(new System.Uri(PersonSelected.ReportUrl));
                } else
                {

                }
            });
        }
    }
}
