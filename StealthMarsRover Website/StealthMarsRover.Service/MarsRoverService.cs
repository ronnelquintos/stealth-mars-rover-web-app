using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using StealthMarsRover.Models;
using StealthMarsRover.Services;

namespace StealthMarsRover.Service
{
    public class MarsRoverService : IMarsRoverService
    {
        private readonly IConfiguration _configuration;

        #region Constructors

        public MarsRoverService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        #endregion

        #region IMarsRoverService Implementations

        public async Task<IList<MarsRover>> DownloadMarsRoverPhotoByDate(IList<DateTime> earthDateTimes)
        {
            using (var httpClient = new HttpClient())
            {
                var builder = new UriBuilder(_configuration.GetSection("MarsRoverApiSettings:ApiEndpoint").Value)
                    { Port = -1 };

                var marsRoverList = new List<MarsRover>();

                var query = HttpUtility.ParseQueryString(builder.Query);
                query["api_key"] = _configuration.GetSection("MarsRoverApiSettings:ApiKey").Value;
                query["page"] = _configuration.GetSection("MarsRoverApiSettings:Page").Value;
                query["Camera"] = _configuration.GetSection("MarsRoverApiSettings:Camera").Value;

                foreach (var earthDateTime in earthDateTimes.Distinct())
                {
                    query["earth_date"] = $"{earthDateTime:yyyy-MM-dd}";
                    builder.Query = query.ToString();
                    var url = builder.ToString();
                    var response = await httpClient.GetAsync(url);
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var marsRover = JsonConvert.DeserializeObject<MarsRover>(responseContent);
                    if (marsRover.MarsRoverPhotos != null)
                    {
                        //selects a picture on a given day
                        var firstMarsRoverPhoto = marsRover.MarsRoverPhotos.FirstOrDefault();
                        if (firstMarsRoverPhoto != null)
                        {
                            var photoByteArray =
                                await httpClient.GetByteArrayAsync(firstMarsRoverPhoto.ImageSource);
                            firstMarsRoverPhoto.ImageBase64 = Convert.ToBase64String(photoByteArray);
                        }
                        marsRover.MarsRoverPhotos = new List<MarsRoverPhoto>{ firstMarsRoverPhoto };
                    }

                    marsRoverList.Add(marsRover);
                }

                return marsRoverList;
            }
        }

        #endregion
    }
}