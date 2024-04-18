import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentDate: string = '';
  currentTime: string = '';

  constructor() { }

  ngOnInit(): void {
    const timer = interval(1000).pipe(
      startWith(0)
    );

    timer.subscribe(() => {
      const now = moment();
      this.currentDate = now.format('YYYY-MM-DD');
      this.currentTime = now.format('HH:mm:ss');
    });
  }
}
