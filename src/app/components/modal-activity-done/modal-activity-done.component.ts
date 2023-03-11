import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';
import { RecordTasksService } from 'src/app/services/record-tasks.service';

@Component({
  selector: 'app-modal-activity-done',
  templateUrl: './modal-activity-done.component.html',
  styleUrls: ['./modal-activity-done.component.css']
})
export class ModalActivityDoneComponent implements OnInit {
  closeModal = false 
  runClock = null;
	running = false;

  constructor(
    public dialogRef: MatDialogRef<ModalActivityDoneComponent>,
    private recordeTasksService: RecordTasksService,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  closeActivityDoneModal(): void {
    this.closeModal = true
    if(this.closeModal) {
      this.dialogRef.close();
    }

    localStorage.removeItem('__prevUserLoggedDateSelected__')
  }

  doneActivity() {
    let activity = JSON.parse(localStorage.getItem('__userId__'))
    localStorage.removeItem('__userId__')

    clearInterval(this.runClock);
    this.runClock = null;
    this.running = false;
    
    this.recordeTasksService.doneTimerTask(activity).subscribe(() => {
      activity.datahorafim = new Date();

      this.closeActivityDoneModal()

      localStorage.setItem('__reloadPage__', JSON.stringify(true))
      localStorage.setItem('__stopTimer__', JSON.stringify(true))

      this.messageService.showMessage('A atividade #' + activity.id + ' foi finalizada.')
    })
  }

}
