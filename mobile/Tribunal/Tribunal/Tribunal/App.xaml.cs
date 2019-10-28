using Rg.Plugins.Popup.Extensions;
using System;
using Tribunal.Views;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

[assembly: XamlCompilation(XamlCompilationOptions.Compile)]
namespace Tribunal
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
            MainPage = new NavigationPage(new MainPage());
        }

        protected override void OnStart()
        {
            MessagingCenter.Subscribe<PersonModel>(new PersonModel(), "ShowDetail", (e) =>
            {
              
                MainPage.Navigation.PushPopupAsync(new DetailPage());
            });
        }
        protected override void OnSleep()
        {
            
        }

        protected override void OnResume()
        {
            
        }
        
        
    }
}
