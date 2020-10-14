using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using StealthMarsRover.Api.CustomAttributes;
using StealthMarsRover.Api.ViewModels;
using StealthMarsRover.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace StealthMarsRover.Api.Controllers
{
    [Route("api/[controller]")]
    public class MarsRoverController : Controller
    {
        private readonly ILogger<MarsRoverController> _logger;
        private readonly IMapper _mapper;
        private readonly IMarsRoverService _marsRoverService;

        public MarsRoverController(ILogger<MarsRoverController> logger,
            IMarsRoverService marsRoverService,
            IMapper mapper)
        {
            _logger = logger;
            _marsRoverService = marsRoverService;
            _mapper = mapper;
        }

        [HttpPost]
        [ApiKeyAuth]
        [Route("get-mars-rover-photos")]
        public async Task<IList<MarsRoverViewModel>> GetMarsRoverPhotosAsync([FromBody] IList<string> earthDates)
        {
            try
            {
                var earthDateTimeList = new List<DateTime>();
                foreach (var earthDate in earthDates)
                    if (DateTime.TryParse(earthDate, out var earthDateTime))
                        earthDateTimeList.Add(earthDateTime);

                var marsRover = await _marsRoverService.DownloadMarsRoverPhotoByDate(earthDateTimeList);
                return _mapper.Map<IList<MarsRoverViewModel>>(marsRover);
            }
            catch (Exception e)
            {
                _logger.Log(LogLevel.Error, $"An error occured while uploading postcodes. {e}");
                return null;
            }
        }
    }
}