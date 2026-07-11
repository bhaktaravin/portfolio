import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TRUSTED_CLIENTS } from '../data/portfolio.data';

@Component({
  selector: 'app-trusted-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trusted-clients.html',
  styleUrls: ['./trusted-clients.css'],
})
export class TrustedClientsComponent {
  readonly clients = TRUSTED_CLIENTS;
}
