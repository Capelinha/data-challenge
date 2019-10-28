using System;
using System.Collections.Generic;
using System.Text;

namespace Tribunal
{
    public class PersonModel
    {
        public string Name { get; private set; }

        private string _firstName;

        public string FirstName
        {
            get { return _firstName; }
            set { _firstName = value; Name = FirstName + " " + LastName; }
        }

        private string _lastName;

        public string LastName
        {
            get { return _lastName; }
            set { _lastName = value; Name = FirstName + " " + LastName; }
        }

        public string PersonId { get; set; }

        public string CPF { get; set; }

        public string RG { get; set; }

        public string CNPJ { get; set; }

        public string UidCreated { get; set; }

        public string ReportUrl { get; set; }

        public string SearchPages { get; set; }

        private IDictionary<string, string> _status;

        public IDictionary<string, string> Status
        {
            get { return _status; }
            set
            {
                _status = value;

                var progress = 0;
                var hitability = 0;

                var length = 0;
                var done = 0;
                var success = 0;
                var d = _status;
                foreach (var k in d.Keys)
                {
                    length++;
                    if (d[k] != "starting")
                    {
                        done++;
                    }

                    if (d[k] == "finished")
                    {
                        success++;
                    }
                }

                progress = (done * 100) / length;
                hitability = (success * 100) / length;

                Finished = progress == 100 ? "True" : "False";
                StatusText = (progress == 100) ? "finalizado" : "executando";
                Progress = progress;
                Hitability = hitability;
            }
        }

        public string Finished { get; set; }

        public int Progress { get; set; }

        public int Hitability { get; set; }

        public string StatusText { get; set; }

        private long _createdAt;

        public long CreatedAt
        {
            get { return _createdAt; }
            set
            {
                _createdAt = value;
                System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
                CreatedAtDate = dtDateTime.AddMilliseconds(_createdAt).ToLocalTime();
            }
        }


        public DateTime CreatedAtDate { get; set; }
    }
}
