import { Component, OnInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { UserLoggedService } from 'src/app/services/user-logged.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RecordTasksService } from 'src/app/services/record-tasks.service';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { CreateActivitiesService } from 'src/app/services/create-activities.service';

@Component({
  selector: 'app-activities-dialog-modal',
  templateUrl: './activities-dialog-modal.component.html',
  styleUrls: ['./activities-dialog-modal.component.css']
})
export class ActivitiesDialogModalComponent implements OnInit { 
  users = [];
  tasks = [];
  closeDialog = false 

  activityLogs = this._formBuilder.group({
    nomeUsuario: [''],
    datePicker: ['', [Validators.required]],
    dataHoraInicio: ['', [Validators.required]],
    dataHoraFim: ['', [Validators.required]],
    taskID: ['', [Validators.required]]
  });

  constructor(
    public dialogRef: MatDialogRef<ActivitiesDialogModalComponent>,
    private titleService: Title,
    private _formBuilder: FormBuilder,
    private userLoggedService: UserLoggedService,
    private recordeTasksService: RecordTasksService,
    public dialog: MatDialog,
    private _elementRef : ElementRef,
    private adapter: DateAdapter<any>,
    private createActivitiesService: CreateActivitiesService
  ) { 
    dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.titleService.setTitle('Registro de atividades manuais');

    this.recordTasks();

    setTimeout(() => {
      this.setDateFocus(); 
    }, 300)

    this.adapter.setLocale('pt-br')

  }

  close(): void {
    this.closeDialog = true
    if(this.closeDialog) {
      this.dialogRef.close();
    }
  }

  getUsersLogged() {
    this.userLoggedService.getUsers().subscribe((response) => {
      this.users = response.itens.sort((a, b) => a.nome.localeCompare(b.nome));

      let user = localStorage.getItem('__authenticationUserData__');

      this.activityLogs.get('nomeUsuario').setValue(user);
    });
  }

  recordTasks() {
    let name = localStorage.getItem('__authenticationUserData__');

    this.getUsersLogged();

    this.recordeTasksService.getTasks(name).subscribe((item) => {
      const data = item.itens

     setTimeout(() => {
      this.tasks.push(...data)
     }, 500)
    })
  }

  setDateFocus() { 
    let dataFocused = this._elementRef.nativeElement.querySelector(`#datePicker`);
    dataFocused.focus()
  } 

  setFinalHourFocus() { 
    let dataFocused = this._elementRef.nativeElement.querySelector(`#dataHoraInicio`);
    
    if(dataFocused.value.length === 5) {
      let dataHoraFinalFocused = this._elementRef.nativeElement.querySelector(`#dataHoraFim`);
      dataHoraFinalFocused.focus()
    }
  }

  setTaskDescriptionFocus(){
    let dataFocused = this._elementRef.nativeElement.querySelector(`#datePicker`);

    if(dataFocused.value.length > 0) {
      let taskDescriptionFocused = this._elementRef.nativeElement.querySelector(`#taskID`);
      taskDescriptionFocused.click()      
    }

    this._elementRef.nativeElement.querySelector(`#taskID`)
  }

  setInicialDateFocus() {
    let dataHoraInicioFocused = this._elementRef.nativeElement.querySelector(`#dataHoraInicio`);
    dataHoraInicioFocused.focus()
  }

  sendData() {
    let newDate: moment.Moment = moment.utc(this.activityLogs.value.datePicker).local();

    this.activityLogs.value.datePicker = newDate.format('DD/MM/YYYY')

    this.activityLogs.value.dataHoraInicio = newDate.format('YYYY-MM-DD') + "T" + this.activityLogs.value.dataHoraInicio + ':00-03:00'

    this.activityLogs.value.dataHoraFim = newDate.format('YYYY-MM-DD') + "T" + this.activityLogs.value.dataHoraFim + ':00-03:00'
    
    this.createActivitiesService.createActivities(this.activityLogs.value).subscribe()

    this._elementRef.nativeElement.querySelector(`#datePicker`).value = '';
    this._elementRef.nativeElement.querySelector(`#datePicker`).focus()

    this._elementRef.nativeElement.querySelector(`#taskID`).value = 'Task';
    this._elementRef.nativeElement.querySelector(`#dataHoraInicio`).value = '';
    this._elementRef.nativeElement.querySelector(`#dataHoraFim`).value = '';

    this.activityLogs.reset()

    let user = localStorage.getItem('__authenticationUserData__');

    this.activityLogs.get('nomeUsuario').setValue(user);

    localStorage.setItem('__reloadPage__', JSON.stringify(true))

  }
}
