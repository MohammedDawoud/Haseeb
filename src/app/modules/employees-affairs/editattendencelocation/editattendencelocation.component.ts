import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { AttendenceLocationSettings } from 'src/app/core/Classes/DomainObjects/AttendenceLocationSettings';
import { AttendenceLocationService } from 'src/app/core/services/Employees-Services/attendence-location.service';


@Component({
  selector: 'app-editattendencelocation',
  templateUrl: './editattendencelocation.component.html',
  styleUrls: ['./editattendencelocation.component.scss']
})
export class EditattendencelocationComponent  implements OnInit {


  map: any;
  userLocation: L.LatLng | undefined;
  marker: L.Marker | undefined; // Single marker to be placed on the map
  searchInput: string = '';  // Bound to search input in the template
  

  attendenceobj:any={
    attendenceLocationSettingsId:0,
    name : null,
    distance : null,
  }

  constructor(private toast :ToastrService,private _attLocation : AttendenceLocationService,
    private translate:TranslateService,private router: Router,private route: ActivatedRoute
  ){

  }
  editRow:any;
  ngOnInit(): void {
debugger
    this.route.queryParams.subscribe(params => {
      const servjson =sessionStorage.getItem('attlocationobj');
       const objectPassed = servjson !== null ? JSON.parse(servjson) : new AttendenceLocationSettings();

       this.editRow = objectPassed;
       
       this.attendenceobj.attendenceLocationSettingsId=this.editRow.attendenceLocationSettingsId;
       this.attendenceobj.name=this.editRow.name;
       this.attendenceobj.distance=this.editRow.distance;
     });



    // Initialize the map (default view centered over a specific location)
    this.map = L.map('map').setView([24.7136, 46.6753], 13); // Default location, e.g., Riyadh

    // Add OpenStreetMap tiles (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Get and mark user's current location
    this.getUserLocation(this.editRow.latitude,this.editRow.longitude,this.editRow.name);

    // Add click event listener to the map
    this.map.on('click', (event: any) => {
      const clickedLocation = event.latlng;
      this.addMarker(clickedLocation, 'Selected Location');
    });
  }

  // Get the user's current location using the browser's Geolocation API
  getUserLocation(lat:any,long:any,name:any): void {

        this.userLocation = new L.LatLng(lat, long);
        this.addMarker(this.userLocation, name);
     
  }

  // Add a marker at a given location (either user's or clicked place)
  addMarker(location: L.LatLng, popupText = 'Selected Location'): void {
    // If there is an existing marker, remove it first
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add a new marker at the specified location
    this.marker = L.marker(location).addTo(this.map).bindPopup(popupText).openPopup();
    this.map.setView(location, 15); // Zoom to the marker
  }

  // Search for a place using Nominatim and add a marker
  searchPlace(): void {
    if (!this.searchInput.trim()) {
      alert('Please enter a location to search for.');
      return;
    }

    const searchQuery = this.searchInput;
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;

    // Make a request to Nominatim
    fetch(nominatimUrl)
      .then(response => response.json())
      .then((result) => {
        if (result && result.length > 0) {
          const lat = result[0].lat;
          const lon = result[0].lon;
          const location = new L.LatLng(lat, lon);
          this.addMarker(location, result[0].display_name);
        } else {
          alert('Location not found. Please try another search.');
        }
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
        alert('Failed to search location. Please try again later.');
      });
  }



  saveLocation() {
    debugger;
    if (
      this.attendenceobj.name == null ||
      this.attendenceobj.name == '' ||
    
      this.attendenceobj.distance == null
    ) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }
    var obj :any ={};
    obj.attendenceLocationSettingsId=this.attendenceobj.attendenceLocationSettingsId;
    obj.name=this.attendenceobj.name;
    obj.distance =this.attendenceobj.distance;
    obj.latitude=this.userLocation?.lat.toString();
    obj.longitude=this.userLocation?.lng.toString();
    this._attLocation.SaveAttendenceLocation(obj).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      if (result.statusCode == 200) {
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.router.navigate(['/employees/attendence-location-list']);
        //this.refreshdata();
        
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  refreshdata(){
      this.attendenceobj.attendenceLocationSettingsId=0;
      this.attendenceobj.name = null;
      this.attendenceobj.distance = null;
    
  }
}
