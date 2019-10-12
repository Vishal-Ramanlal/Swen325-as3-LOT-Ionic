import { Injectable } from '@angular/core';
import { Message } from '../../types';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/interval';



declare var require: any;
@Injectable()
export class MqttService {
  mqttServiceVar = require('mqtt');


  private messageObservable: Observable<Message>
  private messageObserver;
  private client;

  private hasUnreadNotification = false;

  private messageChannel = new MessageChannel();

  constructor() {
    this.client = this.mqttServiceVar.connect('ws://barretts.ecs.vuw.ac.nz:8883');
    this.client.subscribe("swen325/a3");
    this.messageObservable = Observable.create(observer => {
      this.messageObserver = observer;
      this.loadMessages();
    });
  }

  subscribeToMessages(): Observable<Message> {
    return this.messageObservable;
  }

  loadMessages() {
    let myMessageObserver = this.messageObserver;
    this.client.on("message", (topic, payload) => {
      if(!this.validMessage(payload.toString())) {
        return;
      }
      const split = payload.toString().split(',');
      var message = {
        timestamp: split[0],
        room: split[1],
        motionStatus: parseInt(split[2]),
        batteryCharge: parseFloat(split[3])
      };
      myMessageObserver.next(message);
    });
  }
  // To protect against spam
  validMessage(payload: string): Boolean {
    const split = payload.toString().split(',');
    if(split.length !== 4) return false;
    return true;
  }
  getMessageChannel() {
    return this.messageChannel;
  }





  unreadNotification() {
    return this.hasUnreadNotification;
  }
}
