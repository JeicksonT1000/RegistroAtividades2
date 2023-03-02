import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';
import { RecordTasksService } from 'src/app/services/record-tasks.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-update-activies-modal-dialog',
  templateUrl: './update-activies-modal-dialog.component.html',
  styleUrls: ['./update-activies-modal-dialog.component.css']
})
export class UpdateActiviesModalDialogComponent implements OnInit {
  
  closeModal = false 
  activitySelected = []
  pbi = null
  taskID = null
  disabled = true;
  
  activityLogs = this._formBuilder.group({
    descricaoPBI: [''],
    dataSelecionada: [''],
    dataHoraInicio: ['', [Validators.required]],
    dataHoraFim: ['', [Validators.required]],
    descricaoTask: [''],
  });
  
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateActiviesModalDialogComponent>,
    private _elementRef : ElementRef,
    private recordeTasksService: RecordTasksService,
    private adapter: DateAdapter<any>

  ) { }

  ngOnInit(): void {
    this.loadActivityInUpdateModal()

    // Setando data para formato brasileiro
    this.adapter.setLocale('pt-br')

    setTimeout(() => {
      this.setFocusAtInitialHour()
         // Seta a data no padrão brasileiro
      this.adapter.setLocale('pt-br')
    }, 500)
  }

  closeUpdateModal(): void {
    this.closeModal = true
    if(this.closeModal) {
      this.dialogRef.close();
    }
  }

  setFocusAtEndTime() { 
    let focusedInitialTime = this._elementRef.nativeElement.querySelector(`#dataHoraInicio`);
    
    if(focusedInitialTime.value.length === 5) {
      let focusedEndTime = this._elementRef.nativeElement.querySelector(`#dataHoraFim`);
      focusedEndTime.focus()
    }
  }

  // Acessando elementos do DOM
  setFocusAtInitialHour() {
    let focusedInitialHour = this._elementRef.nativeElement.querySelector(`#dataHoraInicio`);
    focusedInitialHour.focus()
  }

  // Carregar dados da atividade nos inputs para atualizar
  loadActivityInUpdateModal() { 
    let userName = localStorage.getItem('__authenticationUserData__')
    let id = JSON.parse(localStorage.getItem('__userId__'))
    let userDate = JSON.parse(localStorage.getItem('__userDate__'))

    var day = userDate.slice(8, 10)
    var month = userDate.slice(5, 7)
    var year = userDate.slice(0, 4)

    var formattedDate = `${day}/${month}/${year}`

    this.recordeTasksService.getFilterName(userName, userDate).subscribe(item => {
      var data = item.itens

      data.filter(item => {
        if(item.id === id) {
          this. activitySelected.push(item)
          this.activityLogs.get('descricaoPBI').setValue(item.descricaoPBI)
          this.activityLogs.get('dataSelecionada').setValue(formattedDate)
          this.activityLogs.get('descricaoTask').setValue(item.descricaoTask)
          this.activityLogs.get('dataHoraInicio').setValue(item.dataHoraInicio.slice(11, 16))
          this.activityLogs.get('dataHoraFim').setValue(item.dataHoraFim.slice(11, 16))
          this.pbi = item.pbi
          this.taskID = item.taskID
        }
      })
    })
  }

  updateActibityHours() {
     var data = {}

     let userDate = JSON.parse(localStorage.getItem('__userDate__'))

     this.activityLogs.value.dataHoraInicio = userDate + "T" + this.activityLogs.value.dataHoraInicio + ':00-03:00'

    this.activityLogs.value.dataHoraFim = userDate + "T" + this.activityLogs.value.dataHoraFim + ':00-03:00'

     this. activitySelected.map(item => {
       data = {
        ...item,
        dataSelecionada: this.activityLogs.value.dataSelecionada,
        dataHoraInicio: this.activityLogs.value.dataHoraInicio,
        dataHoraFim: this.activityLogs.value.dataHoraFim,
       }
     })

     this.closeUpdateModal()
     
     this.recordeTasksService.updateTasks(data).subscribe()

     localStorage.setItem('__reloadPage__', JSON.stringify(true))
  }
}
