import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }
  message = ""

  showMessage(message) {
    this.message = message

    setTimeout(() => {
      this.clearMessage()
    }, 1500)
  }

  clearMessage() {
    this.message = ""
  }
}
