import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { onBackgroundMessage} from "firebase/messaging/sw";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {

    
}
}
