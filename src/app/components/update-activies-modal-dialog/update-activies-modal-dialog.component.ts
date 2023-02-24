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
  dataSelecionada = localStorage.getItem('__userDate__')
  closeDialog = false 
  taskSelected = []
  pbi = null
  taskID = null
  
  activityLogs = this._formBuilder.group({
    descricaoPBI: [''],
    dataSelecionada: [this.dataSelecionada],
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

      data.filter(item => {
        if(item.id === id) {
          this.activityLogs.get('descricaoPBI').setValue(item.descricaoPBI)
          this.activityLogs.get('dataSelecionada').setValue(userDate)
          this.activityLogs.get('descricaoTask').setValue(item.descricaoTask)
          this.activityLogs.get('dataHoraInicio').setValue(item.dataHoraInicio.slice(11, 16))
          this.activityLogs.get('dataHoraFim').setValue(item.dataHoraFim.slice(11, 16))
          this.pbi = item.pbi
          this.taskID = item.taskID
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
     var data = {}

     let userDate = JSON.parse(localStorage.getItem('__userDate__'))

     this.activityLogs.value.dataHoraInicio = userDate + "T" + this.activityLogs.value.dataHoraInicio + ':00-03:00'

    this.activityLogs.value.dataHoraFim = userDate + "T" + this.activityLogs.value.dataHoraFim + ':00-03:00'

     this.taskSelected.map(item => {
       data = {
        ...item,
        dataSelecionada: this.activityLogs.value.dataSelecionada,
        dataHoraInicio: this.activityLogs.value.dataHoraInicio,
        dataHoraFim: this.activityLogs.value.dataHoraFim,
       }
     })

     this.close()
     
     this.recordeTasksService.updateTasks(data).subscribe()

     localStorage.setItem('__reloadPage__', JSON.stringify(true))
  }
}
