import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';              // For *ngIf etc
import { LoginComponent } from '../login/login.component';    // तुमचा LoginComponent चा path बघा

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  standalone: true,
  imports: [CommonModule, LoginComponent]  // इथे import करा
})
export class PopupComponent {
  showLoginPopup = true;  // जर popup मध्ये पुन्हा login component show करायचा असेल तर flag ठेवा

  closePopup() {
    this.showLoginPopup = false;
  }
}
