import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page1',
  imports: [NgIf],
  templateUrl: './page1.component.html',
  styleUrl: './page1.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Page1Component {
      tokenExpired:boolean=false;
      
}
