import {
  Component,
} from '@angular/core';
import { GlobalServiceService } from '../global-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(
    private globalService: GlobalServiceService,
    private router: Router
  ) {
    this.globalService.getIsLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  homeHandler() {
    this.router.navigate(['/recipes']);
  }

  logoutHandler() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    this.globalService.updateIsLoggedIn(false);
    this.globalService.getIsLoggedIn().subscribe((isLoggedIn) => {
      this.router.navigate(['/recipes'], { queryParams: { page: 1 } });
    });
  }
}
