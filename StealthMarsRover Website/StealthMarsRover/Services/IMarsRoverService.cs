using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StealthMarsRover.Models;

namespace StealthMarsRover.Services
{
    public interface IMarsRoverService
    {
        Task<IList<MarsRover>> DownloadMarsRoverPhotoByDate(IList<DateTime> earthDateTimes);
    }
}