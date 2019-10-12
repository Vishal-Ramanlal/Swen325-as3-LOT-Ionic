import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BatteryPage } from '../pages/battery/battery';
import { GraphPage } from '../pages/graphs/graph';
import { TabsPage } from '../pages/tabs/tabs';
import {RoomPage} from '../pages/room/room'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MqttService } from '../services/mqtt/mqtt';

@NgModule({
  declarations: [
    MyApp,
    BatteryPage,
    GraphPage,
    TabsPage,
    RoomPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BatteryPage,
    GraphPage,
    TabsPage,
    RoomPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MqttService
  ]
})
export class AppModule {}
