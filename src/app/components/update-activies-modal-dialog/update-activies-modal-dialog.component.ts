import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { RecordTasksService } from 'src/app/services/record-tasks.service';

@Component({
  selector: 'app-update-activies-modal-dialog',
  templateUrl: './update-activies-modal-dialog.component.html',
  styleUrls: ['./update-activies-modal-dialog.component.css']
})
export class UpdateActiviesModalDialogComponent implements OnInit {
  closeDialog = false 
  taskSelected = []

  activityLogs = this._formBuilder.group({
    descricaoPBI: [''],
    dataSelecionada: [''],
    dataHoraInicio: [''],
    dataHoraFim: [''],
    descricaoTask: [''],
  });
  
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateActiviesModalDialogComponent>,
    private _elementRef : ElementRef,
    private recordeTasksService: RecordTasksService
  ) { }

  ngOnInit(): void {


    this.editTasks()
  }

  close(): void {
    this.closeDialog = true
    if(this.closeDialog) {
      this.dialogRef.close();
    }
  }

  // Atualizar uma atividade
  editTasks() { 
    let userName = localStorage.getItem('__authenticationUserData__')
    let id = JSON.parse(localStorage.getItem('__userId__'))
    let userDate = JSON.parse(localStorage.getItem('__userDate__'))

    this.recordeTasksService.getFilterName(userName, userDate).subscribe(item => {
      var data = item.itens

      
      this.taskSelected = data

      setTimeout(() => {
        console.log(this.taskSelected)
      }, 500)

      data.filter(item => {
        if(item.id === id) {
          this.activityLogs.get('descricaoPBI').setValue(item.descricaoPBI)
          this.activityLogs.get('dataSelecionada').setValue(userDate)
          this.activityLogs.get('descricaoTask').setValue(item.descricaoTask)
        }
      })
    })
  }

  setFinalHourFocus() { 
    let dataFocused = this._elementRef.nativeElement.querySelector(`#dataHoraInicio`);
    
    if(dataFocused.value.length === 5) {
      let dataHoraFinalFocused = this._elementRef.nativeElement.querySelector(`#dataHoraFim`);
      dataHoraFinalFocused.focus()
    }
  }

  changeHourTask() {
     let userId = JSON.parse(localStorage.getItem('__userId__'))

     var data = {}

     let newDate: moment.Moment = moment.utc(this.activityLogs.value.dataSelecionada).local();

     this.activityLogs.value.dataHoraInicio = newDate.format('YYYY-MM-DD') + "T" + this.activityLogs.value.dataHoraInicio + ':00-03:00'

    this.activityLogs.value.dataHoraFim = newDate.format('YYYY-MM-DD') + "T" + this.activityLogs.value.dataHoraFim + ':00-03:00'

     this.taskSelected.map(item => {
       data = {
        ...item,
        dataHoraInicio: this.activityLogs.value.dataHoraInicio,
        dataHoraFim: this.activityLogs.value.dataHoraFim,
       }
     })

     this.recordeTasksService.updateTasks(userId, {
      ...data
     }).subscribe()
  }
}
