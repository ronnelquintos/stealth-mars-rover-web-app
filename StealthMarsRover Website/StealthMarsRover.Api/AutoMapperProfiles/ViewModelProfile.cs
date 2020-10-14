using AutoMapper;
using StealthMarsRover.Api.ViewModels;
using StealthMarsRover.Models;

namespace StealthMarsRover.Api.AutoMapperProfiles
{
    public class ViewModelProfile : Profile
    {
        public ViewModelProfile()
        {
            CreateMap<MarsRover, MarsRoverViewModel>();
            CreateMap<MarsRoverPhoto, MarsRoverPhotoViewModel>();
        }
    }
}
