import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { UserLoggedService } from 'src/app/services/user-logged.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RecordTasksService } from 'src/app/services/record-tasks.service';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { CreateActivitiesService } from 'src/app/services/create-activities.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-activities-dialog-modal',
  templateUrl: './activities-dialog-modal.component.html',
  styleUrls: ['./activities-dialog-modal.component.css']
})
export class ActivitiesDialogModalComponent implements OnInit { 
  users = [];
  activities = [];
  closeModal = false 
  requestIsValid = false

  activityLogs = this._formBuilder.group({
    nomeUsuario: [''],
    datePicker: ['', [Validators.required]],
    dataHoraInicio: ['', [Validators.required]],
    dataHoraFim: ['', [Validators.required]],
    taskID: ['', [Validators.required]]
  });
  @ViewChild(MatDatepicker) datePicker: MatDatepicker<Date>;

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

    this.recordActivities();

    setTimeout(() => {
      this.setFocusOnDate(); 
    }, 300)

    // Setando data para formato brasileiro
    this.adapter.setLocale('pt-br')

    
    let userLoggedDateSelected = JSON.parse(localStorage.getItem('__prevUserLoggedDateSelected__'))

    if(userLoggedDateSelected) {
      this.activityLogs.get('datePicker').setValue(userLoggedDateSelected)
    }
  }
  

  closeActivityModal(): void {
    this.closeModal = true
    if(this.closeModal) {
      this.dialogRef.close();
    }

    localStorage.removeItem('__prevUserLoggedDateSelected__')
  }

  getUsersLogged() {
    this.userLoggedService.getUsers().subscribe((response) => {
      this.users = response.itens.sort((a, b) => a.nome.localeCompare(b.nome));

      let user = localStorage.getItem('__authenticationUserData__');

      this.activityLogs.get('nomeUsuario').setValue(user);
    });
  }

  // Acessando elementos do DOM
  setFocusOnDate() { 
    let userLoggedDateSelected = JSON.parse(localStorage.getItem('__prevUserLoggedDateSelected__'))

    if(!userLoggedDateSelected) {
      let focusedDate = this._elementRef.nativeElement.querySelector(`#datePicker`);
      focusedDate.focus()
    }
  } 

  setFocusAtFinalHour() { 
    let focusedDate = this._elementRef.nativeElement.querySelector(`#dataHoraInicio`);
    
    if(focusedDate.value.length === 5) {
      let focusedFinalHour = this._elementRef.nativeElement.querySelector(`#dataHoraFim`);
      focusedFinalHour.focus()
    }
  }
  
  setFocusAtInitialHour() {
    let focusedInitialHour = this._elementRef.nativeElement.querySelector(`#dataHoraInicio`);
    focusedInitialHour.focus()
  }

  setFocusOnTaskDescription(){
    let focusedDate = this._elementRef.nativeElement.querySelector(`#datePicker`);

    if(focusedDate.value.length > 0) {
      let focusedTaskDescription = this._elementRef.nativeElement.querySelector(`#taskID`);
      focusedTaskDescription.click()      
    }

    this._elementRef.nativeElement.querySelector(`#taskID`)
  }

  setFocusOnSaveButton() {
    let focusOnEndDate = this._elementRef.nativeElement.querySelector(`#dataHoraFim`);

    if(focusOnEndDate.value.length === 5) {
      let focusOnSaveButton = this._elementRef.nativeElement.querySelector(`#btn-save`);
      focusOnSaveButton.focus()
    }
  }

  // Recupera as atividades
  recordActivities() {
    let user = localStorage.getItem('__authenticationUserData__');

    this.getUsersLogged();

    this.recordeTasksService.getTasks(user).subscribe((item) => {
      const data = item.itens

     setTimeout(() => {
      this.activities.push(...data)
     }, 500)
    })
  }

  // Cadastra uma atividade
  registerActivity() {
    if(
      this.activityLogs.value.datePicker !== ""
      ||
      this.activityLogs.value.taskID !== ""
      ||
      this.activityLogs.value.dataHoraInicio !== ""
      ||
      this.activityLogs.value.dataHoraFim !== ""
    ) {
      this.closeActivityModal()
      this.dialog.open(ActivitiesDialogModalComponent)
      this.requestIsValid = true
    } else {
      this.requestIsValid = false
      this.setFocusOnDate()
    }

    let formattedDate: moment.Moment = moment.utc(this.activityLogs.value.datePicker).local();

    this.activityLogs.value.datePicker = formattedDate.format('DD/MM/YYYY')

    this.activityLogs.value.dataHoraInicio = formattedDate.format('YYYY-MM-DD') + "T" + this.activityLogs.value.dataHoraInicio + ':00-03:00'

    this.activityLogs.value.dataHoraFim = formattedDate.format('YYYY-MM-DD') + "T" + this.activityLogs.value.dataHoraFim + ':00-03:00'

    if(this.requestIsValid === false) {
      return
    }
    this.createActivitiesService.createActivities(this.activityLogs.value).subscribe()

    let user = localStorage.getItem('__authenticationUserData__');

    this.activityLogs.get('nomeUsuario').setValue(user);

    localStorage.setItem('__reloadPage__', JSON.stringify(true))
    localStorage.setItem('__prevUserLoggedDateSelected__', JSON.stringify(this.activityLogs.value.datePicker))

  }
}
