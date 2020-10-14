import { Component, OnInit } from "@angular/core";
import { MarsRoverService } from "../services/mars-rover.service";
import { MarsRoverPhoto } from "../models/mars-rover-photo.model";
import { saveAs } from "file-saver";
import * as JSZip from "jszip";
import { AnimationOptions } from "ngx-lottie";
import { DatePipe } from "@angular/common";
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private datePipe: DatePipe;
  private marsRoverService: MarsRoverService;
  private fileToUpload: File;
  private isUploadButtonEnabled: boolean;
  private errorMessage: string;
  private marsRoverPhotos: Array<MarsRoverPhoto>;
  private isLoading: boolean;
  private earthDateBrowseFileText: string;
  private earthDateBrowseFileDefaultText = "Choose earth dates text file";
  private lottieOptions: AnimationOptions;
  private marsRoverPhotoEarthDates: Array<string>;
  private invalidEarthDates: Array<string>;

  constructor(marsRoverService: MarsRoverService,
    datePipe: DatePipe) {
    this.datePipe = datePipe;
    this.marsRoverService = marsRoverService;
  }

  ngOnInit(): void {
    this.isUploadButtonEnabled = false;
    this.fileToUpload = null;
    this.errorMessage = "";
    this.marsRoverPhotos = new Array<MarsRoverPhoto>();
    this.isLoading = false;
    //Workaround - Bootsrap custom-file-label cannot update the browse file text based on the selected file. 
    this.earthDateBrowseFileText = this.earthDateBrowseFileDefaultText;
    this.lottieOptions = {
      path: "/assets/mars-rover-lottie.json",
    }
    this.marsRoverPhotoEarthDates = new Array<string>();
    this.invalidEarthDates = new Array<string>();
  }

  handleFileInput(files: FileList) {
    this.errorMessage = null;
    this.isUploadButtonEnabled = false;
    this.invalidEarthDates = new Array<string>();
    this.marsRoverPhotoEarthDates = new Array<string>();
    this.earthDateBrowseFileText = this.earthDateBrowseFileDefaultText;

    if (files.length > 0) {
      this.isUploadButtonEnabled = true;
      this.fileToUpload = files.item(0);

      var fileExtension = this.fileToUpload && this.fileToUpload.name.split(".").length > 1
        ? this.fileToUpload.name.split(".")[this.fileToUpload.name.split(".").length - 1]
        : null;
      if (fileExtension && fileExtension === "txt") {
        this.earthDateBrowseFileText = this.fileToUpload.name;
        this.errorMessage = null;

        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          var earthDatesFromFile = fileReader.result.toString().split(/[\r\n]+/);
          for (let earthDateFromFile of earthDatesFromFile.filter(value => value && value !== "")) {
            var momentDate = moment(earthDateFromFile);
            if (momentDate.isValid() && momentDate.date() <= momentDate.daysInMonth()) {
              this.marsRoverPhotoEarthDates.push(momentDate.format("yyyy-MM-DD"));
            } else {
              this.invalidEarthDates.push(earthDateFromFile);
            }
          }

          if (this.invalidEarthDates && this.invalidEarthDates.length > 0) {
            this.errorMessage = `The selected file contains invalid entries: ${this.invalidEarthDates.join(", ")}`;
            this.isUploadButtonEnabled = false;
          }
        }
        fileReader.readAsText(this.fileToUpload);
      } else {
        this.errorMessage = "Invalid file type. Please select a text file.";
        this.isUploadButtonEnabled = false;
        this.earthDateBrowseFileText = this.earthDateBrowseFileDefaultText;
      }
    }
  }

  getMarsRoverPhotos() {
    this.isLoading = true;
    if (this.marsRoverPhotoEarthDates.length > 0) {
      this.marsRoverService.getMarsRoverPhotos(this.marsRoverPhotoEarthDates).subscribe(marsRoverList => {
          if (marsRoverList) {
            let zip = new JSZip();
            this.marsRoverPhotos = new Array<MarsRoverPhoto>();
            marsRoverList.forEach(marsRover => {
              if (marsRover.marsRoverPhotos.length > 0) {
                var marsRoverPhoto = marsRover.marsRoverPhotos[0];
                this.marsRoverPhotos.push(marsRoverPhoto);
                var filename = marsRoverPhoto.imageSource && marsRoverPhoto.imageSource.split("/").length > 1
                  ? marsRoverPhoto.imageSource.split("/")[marsRoverPhoto.imageSource.split("/").length - 1]
                  : null;

                zip.file(`${marsRoverPhoto.earthDate}_${filename}`, marsRoverPhoto.imageBase64, { base64: true });
              }
            });

            if (zip.files) {
              zip.generateAsync({ type: "blob" })
                .then(function callback(blob) {

                  // see FileSaver.js
                  saveAs(blob, `${Date.now()}_MarsRoverPhotos.zip`);
                });
              this.isLoading = false;
            }
          }
        },
        result => {
          this.errorMessage =
            "An error occured while downloading the Mars Rover photos. Please try again or contact you web administrator.";
          this.isLoading = false;
        });
    }
  }
}


