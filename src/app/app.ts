import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerificationModule } from './verification/verification.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VerificationModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-app');
}
