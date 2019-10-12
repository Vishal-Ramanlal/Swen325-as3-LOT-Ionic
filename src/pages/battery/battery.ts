import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MqttService } from '../../services/mqtt/mqtt';
import { Message } from '../../types';
@IonicPage()
@Component({
  selector: 'page-battery',
  templateUrl: 'battery.html',
})
export class BatteryPage {

  private batCol = ['#FF0400', "#FF4F4F", "#FF8D8D", "#FFBBBB", "#FFE9E9", "#DDFFD2", "#A2FF85", "#6EFF4D", "#49FF24", "#04FF00", "00FF00"]

  batStatus = {toilet: null, bedroom: null, living: null, kitchen: null, dining: null};

  constructor(public navCtrl: NavController, public navParams: NavParams, public mqtt: MqttService) {
  }

  ionViewDidLoad() {
    this.mqtt.subscribeToMessages().subscribe((message) => {
      this.updateBatteryStatus(message);
    })

    // Listens for message from service worker and if the  notification is clicked
    // navigate to graphs screen
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if(event.data === 'notificationClicked') {
          this.navCtrl.parent.select(0);
        }
      })
    }
  }

  updateBatteryStatus(message: Message) {
    const { room, batteryCharge } = message;
    this.batStatus[room] = batteryCharge;
  }

  getRoomNames(): string[] {
    var roomNames = Object.keys(this.batStatus)
    return roomNames;
  }

  getBatRoomName(roomName: string) {
    const percentage = this.batStatus[roomName];
    if(percentage === null) { return 'N/A' }
    return percentage;
  }

  getBatteryColor(percentage) {
    if(percentage === 'N/A') { return "#FFFFFF";}
    var percent = parseInt(percentage);
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    percent = Math.floor(percent/10);
    return this.batCol[percent];
  }



}
