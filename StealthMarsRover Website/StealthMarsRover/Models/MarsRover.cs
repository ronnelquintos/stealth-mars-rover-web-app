using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace StealthMarsRover.Models
{
    public class MarsRover
    {
        #region Properties

        [JsonProperty("photos")]
        public List<MarsRoverPhoto> MarsRoverPhotos { get; set; }

        #endregion
    }
}