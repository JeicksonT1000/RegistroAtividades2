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

    }, 1000)
  }

  clearMessage() {
    this.message = ""
  }
}
