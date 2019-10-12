import { Component } from '@angular/core';

import { GraphPage } from '../graphs/graph';
import { BatteryPage } from '../battery/battery';
import {RoomPage} from '../room/room';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = GraphPage;
  tab2Root = BatteryPage;
  tab3Root = RoomPage;

  constructor() {

  }
}
