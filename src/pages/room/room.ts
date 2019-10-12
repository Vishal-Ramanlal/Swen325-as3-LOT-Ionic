import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MqttService } from '../../services/mqtt/mqtt';
import { Message } from '../../types';

/**
 * Generated class for the RoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {


  private roomColor = ['#FF0400', "#00FF00"]

  roomStatus = {toilet: null, bedroom: null, living: null, kitchen: null, dining: null};

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
    const { room, motionStatus } = message;
    this.roomStatus[room] = motionStatus;
  }

  getRoomNames(): string[] {
    var roomNames = Object.keys(this.roomStatus)
    return roomNames;
  }

  getRoomStatusFromRoomName(roomName: string) {
    const percentage = this.roomStatus[roomName];
    if(percentage === null) { return 'N/A' }
    return percentage;
  }
  getRoomTitle(roomName: string) {
    const status = this.roomStatus[roomName]
    var i = parseInt(status);
    if(status === null) { return 'N/A' }
    if(i == 1){return 'THOT DETECTED'}
    if(i == 0){return 'no detections'}
    //return status;
  }
  getRoomColor(active) {
    if(active === 'N/A') { return "#FFFFFF";}
    var i = parseInt(active);

    if (i <= 0){ i = 0;}
    if (i >= 1){ i = 1;};

    return this.roomColor[i];

  }

}
