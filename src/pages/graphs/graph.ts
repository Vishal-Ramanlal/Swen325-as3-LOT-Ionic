import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Observable, Subscription } from 'rxjs';
import { MqttService } from '../../services/mqtt/mqtt';
import { Message } from '../../types';
const moment = require('moment');
declare var require: any



@IonicPage()
@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html',
})
export class GraphPage {

  @ViewChild('chartCanvas') chartCanvas;
  @ViewChild('chartCanvas2') chartCanvas2;
  private lastLoc: string = null;
  private deviceDetectionCount = {
    bedroom: 0,
    toilet: 0,
    living: 0,
    kitchen: 0,
    dining: 0
  }
  private lastMotionTime = 0;
  private pieChart;
  private barChart;
  private labels;
  private timer: Subscription;

  private waitingForNotificationClick = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mqtt: MqttService) {
    this.labels = Object.keys(this.deviceDetectionCount);
  }

  ionViewDidLoad() {
    this.mqtt.subscribeToMessages().subscribe((mes) => {
      this.messageChecker(mes);
      this.updateChart();
    });
    this.initChart();

    // Increment timer each second
    this.timer = Observable.interval(1000).subscribe((val) => { this.incrementTimer(); })

    // If the notification has been clicked, reset the waiting status.
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if(event.data === 'notificationClicked') {
          this.waitingForNotificationClick = false;
        }
      });
    }
  }

  messageChecker(mes: Message) {
    const {room, motionStatus} = mes;

    if(motionStatus === 1) {
      this.deviceDetectionCount[room] = this.deviceDetectionCount[room] + 1;
      this.lastLoc = room;
      this.lastMotionTime = 0;
    }
  }

  initChart() {
    const data = Object.keys(this.deviceDetectionCount).map((key) => {
      this.deviceDetectionCount[key];
    });
    this.barChart = new Chart(this.chartCanvas2.nativeElement, {

      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: '# of Votes',
          data: data,
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)'
          ]
        }]
      }

    });
    this.pieChart = new Chart(this.chartCanvas.nativeElement, {

      type: 'doughnut',
      data: {
          labels: this.labels,
          datasets: [{
              label: '# of Votes',
              data: data,
              backgroundColor: [
                  'rgb(54, 162, 235)',
                  'rgb(255, 206, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(153, 102, 255)',
                  'rgb(255, 159, 64)'
              ]
          }]
      }

    });
  }

  updateChart() {

    const data = Object.keys(this.deviceDetectionCount).map((key) => {
      return this.deviceDetectionCount[key];
    });

    this.pieChart.data.datasets[0].data = data;
    this.barChart.data.datasets[0].data = data;
    this.pieChart.update();
    this.barChart.update();
  }

  getlastLoc() {
    if(this.lastLoc === null) { return 'N/A'; }
    return this.lastLoc;
  }

  getTimeMotion() {

    let displayTime;
    if(this.lastMotionTime < 60) {
      displayTime = this.lastMotionTime;
      var label = ' second';
      if(this.lastMotionTime != 1) { label += 's'; }
      displayTime += label;
    } else {
      var min = Math.floor(this.lastMotionTime / 60);
      var sec = this.lastMotionTime % 60;

      var secLabel = ' second';
      if(sec != 1) secLabel += 's';

      var minLabel = ' minute';
      if(min > 1) minLabel += 's ';
      else { minLabel += ' ';}
      displayTime = min.toString() + minLabel + sec.toString() + secLabel;
    }

    return displayTime;
  }

  showChart(): Boolean {

    const { bedroom, toilet, kitchen, living, dining } = this.deviceDetectionCount;

    return !(bedroom === 0 && toilet === 0 && kitchen === 0 && living === 0 && dining === 0);
  }


  incrementTimer() {
    this.lastMotionTime++;

    // If a certain time has passed since the last motion a notification
    // hasn't been presented and not dismissed, send a notification
    if( navigator.serviceWorker.controller && this.lastMotionTime === 20 && !this.waitingForNotificationClick) {
      this.waitingForNotificationClick = true;
      navigator.serviceWorker.controller.postMessage('notification');
    }
  }

}
