using Rg.Plugins.Popup.Extensions;
using Rg.Plugins.Popup.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Tribunal.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class DetailPage: PopupPage
	{
		public DetailPage ()
		{
			InitializeComponent ();
		}

        protected override bool OnBackButtonPressed()
        {
            Navigation.PopPopupAsync();
            return false;
        }
    }
}