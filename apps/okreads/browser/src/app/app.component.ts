import { Component } from '@angular/core';
import { Constants } from '@tmo/shared/models';

@Component({
  selector: 'tmo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constants = Constants;
}
