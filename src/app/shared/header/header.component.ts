import { Component, OnDestroy, OnInit, afterRender } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';
import { clearInterval } from 'timers';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentDate: string = '';
  currentTime: string = '';

  private interval_id? : number;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.interval_id = window.setInterval(() => {
        const now = moment();
        this.currentDate = now.format('YYYY-MM-DD');
        this.currentTime = now.format('HH:mm:ss');
      }, 1000);
    }
  }
}
