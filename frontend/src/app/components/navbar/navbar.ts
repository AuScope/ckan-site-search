import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  appTitle = environment.appTitle;
  loginMenuOpen = false;

  loginOptions = [
    { label: 'Data Repository', url: 'https://repository.data.auscope.org.au/user/login' },
    { label: 'Sample Repository', url: 'https://sample.data.auscope.org.au/user/login' },
    { label: 'Instrument Repository', url: 'https://pidinst.data.auscope.org.au/user/login' },
  ];

  toggleLoginMenu(): void {
    this.loginMenuOpen = !this.loginMenuOpen;
  }

  closeLoginMenu(): void {
    this.loginMenuOpen = false;
  }
}
