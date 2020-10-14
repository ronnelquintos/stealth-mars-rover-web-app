import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { MarsRover } from "../models/mars-rover.model";
import { Observable } from "rxjs";

@Injectable()
export class MarsRoverService {
  private baseUrl: string;
  private apiKey: string;
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.baseUrl = environment.stealthMarsRoverApi;
    this.apiKey = environment.stealthMarsRoverApiKey;
    this.httpClient = httpClient;
  }

  getMarsRoverPhotos(earthDates: Array<string>): Observable<Array<MarsRover>> {
    return this.httpClient.post<Array<MarsRover>>(this.baseUrl + "api/marsrover/get-mars-rover-photos", earthDates,
      {
         headers: {
            'StealthMarsRoverApiKey': this.apiKey
         }
      });
  }
}
