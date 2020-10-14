using System;

namespace StealthMarsRover.Api.ViewModels
{
    public class MarsRoverPhotoViewModel
    {
        #region Properties

        public long NasaImageId { get; set; }

        public string ImageSource { get; set; }

        public DateTime EarthDate { get; set; }

        public string ImageBase64 { get; set; }

        #endregion
    }
}
