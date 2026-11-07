import { Component } from '@angular/core';

import { TRUSTED_CLIENTS } from '../data/portfolio.data';

@Component({
  selector: 'app-trusted-clients',
  standalone: true,
  imports: [],
  templateUrl: './trusted-clients.html',
  styleUrls: ['./trusted-clients.css'],
})
export class TrustedClientsComponent {
  readonly clients = TRUSTED_CLIENTS;
}
