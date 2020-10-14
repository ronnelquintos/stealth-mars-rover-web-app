using System;
using System.Collections.Generic;
using FakeItEasy;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StealthMarsRover.Service;
using StealthMarsRover.Services;

namespace StealthMarsRover.UnitTest
{
    [TestClass]
    public class MarsRoverServiceTest
    {
        private IMarsRoverService _marsRoverService;

        [TestInitialize]
        public void InitializeTest()
        {
            _marsRoverService = new MarsRoverService(A.Fake<IConfiguration>());
        }

        [TestMethod]
        public void Test_DownloadMarsRoverPhotoByDate()
        {
        }
    }
}