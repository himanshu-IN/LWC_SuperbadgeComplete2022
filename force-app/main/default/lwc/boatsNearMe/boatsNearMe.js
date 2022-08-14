// imports
import { api, LightningElement, wire } from "lwc";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = "You are here!";
const ICON_STANDARD_USER = "standard:user";
const ERROR_TITLE = "Error loading Boats Near Me";
const ERROR_VARIANT = "error";
export default class BoatsNearMe extends LightningElement {
  @api
  boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered = false;

  latitude;
  longitude;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, {
    latitude: "$latitude",
    longitude: "$longitude",
    boatTypeId: "$boatTypeId"
  })
  wiredBoatsJSON({ error, data }) {
    if (data) {
      this.createMapMarkers(JSON.parse(data));
    }else if (error) {
      const event = new ShowToastEvent({
        title: ERROR_TITLE,
        message:JSON.stringify(error),
        variant:ERROR_VARIANT
    });
    this.dispatchEvent(event);
    this.isLoading = false;

    }
  }

  renderedCallback() {
    if (this.isRendered === false) {
      this.getLocationFromBrowser();
  }
  this.isRendered = true;
  }

  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Get the Latitude and Longitude from Geolocation API
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      },(error) => {
        const event = new ShowToastEvent({
          title: ERROR_TITLE,
          message:JSON.stringify(error),
          variant:ERROR_VARIANT
      });
      this.dispatchEvent(event);
      }
      );
    }
    this.isLoading = false;
  }

  // Creates the map markers
  createMapMarkers(boatData) {
    let newMarkers = boatData.map((boat) => {
      let temp = {
        location: {
          Latitude: boat.Geolocation__Latitude__s,
          Longitude: boat.Geolocation__Longitude__s
        },
        title: boat.Name
      };
      return temp;
    });
    newMarkers.unshift({
      location: {
        Latitude: this.latitude,
        Longitude: this.longitude
      },
      title: LABEL_YOU_ARE_HERE,
      icon: ICON_STANDARD_USER
    });
    this.mapMarkers = newMarkers;
  }
}
