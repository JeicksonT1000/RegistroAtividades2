import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RecordTasksService } from 'src/app/services/record-tasks.service';
import { UpdateActiviesModalDialogComponent } from '../update-activies-modal-dialog/update-activies-modal-dialog.component';

@Component({
  selector: 'app-delete-activities-modal',
  templateUrl: './delete-activities-modal.component.html',
  styleUrls: ['./delete-activities-modal.component.css']
})
export class DeleteActivitiesModalComponent implements OnInit {
  closeDialog = false
  
  constructor(
    public dialogRef: MatDialogRef<UpdateActiviesModalDialogComponent>,
    private recordeTasksService: RecordTasksService
  ) { }

  ngOnInit(): void {
  }

  // Fechar o modal
  close(): void {
    this.closeDialog = true
    if(this.closeDialog) {
      this.dialogRef.close();
    }
  }

  // Deletar uma atividade 
  deleteActivity() {
    let id = JSON.parse(localStorage.getItem('__userId__'))

    this.recordeTasksService.deleteTask(id).subscribe()
  }
}
