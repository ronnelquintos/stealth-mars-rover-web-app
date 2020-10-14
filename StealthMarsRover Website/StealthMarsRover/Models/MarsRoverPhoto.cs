using System;
using System.IO;
using Newtonsoft.Json;

namespace StealthMarsRover.Models
{
    public class MarsRoverPhoto
    {
        #region Properties

        [JsonProperty("id")]  public long NasaImageId { get; set; }

        [JsonProperty("img_src")] public string ImageSource { get; set; }

        [JsonProperty("earth_date")] public DateTime EarthDate { get; set; }

        public string ImageBase64 { get; set; }

        #endregion
    }
}