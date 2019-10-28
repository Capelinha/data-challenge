using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tribunal.Layers.Business;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Tribunal.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TabbedPage1 : TabbedPage
    {
        PersonBusiness pBusiness = new PersonBusiness();
        IList<PersonModel> listapBusiness;

       
        public TabbedPage1()
        {
             
            InitializeComponent();
        }

        private void SearchBar_SearchButtonPressed(object sender, EventArgs e)
        {
            //listapBusiness = pBusiness.GetPeople();
            //var keyword = SearchBar.Text;
            //var suggestions = listapBusiness.Where(l=> l.Name.Contains(keyword));
            //// var s = from c in listapBusiness where c.Name.Contains(keyword) select c;

            //listaPessoas.ItemsSource = suggestions;
        }

        private void SearchBar_TextChanged(object sender, TextChangedEventArgs e)
        {

            //listapBusiness = pBusiness.GetPeople();
            //var keyword = SearchBar.Text;
            //var suggestions = listapBusiness.Where(l => l.Name.ToLower().Contains(keyword));
            //listaPessoas.ItemsSource = suggestions;
        }
    }
}