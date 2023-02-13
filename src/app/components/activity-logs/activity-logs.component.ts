import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { RecordTasksService } from 'src/app/services/record-tasks.service';
import { UserLoggedService } from 'src/app/services/user-logged.service';
import { ActivitiesDialogModalComponent } from '../activities-dialog-modal/activities-dialog-modal.component';

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.css'],
})
export class ActivityLogsComponent implements OnInit {
  users = [];
  tasksList = [];
  paginaAtual = 1

  // Seta a data de atual
  currentDate = new Date()

  activityLogs = this._formBuilder.group({
    nomeUsuario: [''],
    datePicker: [this.currentDate],
  });
task: any;

  constructor(
    private titleService: Title,
    private userLoggedService: UserLoggedService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private adapter: DateAdapter<any>,
    private recordeTasksService: RecordTasksService,
    private _elementRef : ElementRef
  ) {
  }

  ngOnInit(): void {
    
    this.titleService.setTitle('Registro de atividades manuais');

    this.getUsersLogged();

    this.adapter.setLocale('pt-br')

    // setTimeout(() => {
    //   this.recordTasks()
    // }, 500)

  }

  openModalActivities(): void {
    this.dialog.open(ActivitiesDialogModalComponent)
     
    
    // dialogRef.afterClosed().subscribe(result => {
      
    // });
  }

  getUsersLogged() {
    this.userLoggedService.getUsers().subscribe((response) => {
      this.users = response.itens.sort((a: { nome: string; }, b: { nome: any; }) => a.nome.localeCompare(b.nome));

      let user = localStorage.getItem('__authenticationUserData__');

      this.activityLogs.get('nomeUsuario').setValue(user);
    });
  }

  //  Recupera as atividades
  recordTasks() {
    let date = String(this.activityLogs.value.datePicker)
    let newDate: moment.Moment = moment.utc(this.activityLogs.value.datePicker).local();
    date = newDate.format('YYYY-MM-DD')

    this.recordeTasksService.getFilterName(this.activityLogs.value.nomeUsuario, date).subscribe((item) => {
     const data = item.itens

     this.tasksList = data

     console.log(this.tasksList)

    //  setTimeout(() => {
    //   this.tasksList.push(data)

    //  }, 500)
    })
  }

  // Função para filtrar tasks pela data
  filterTasks() {
    
  }

  changeValueName() {
    let dataHoraFinalFocused = this._elementRef.nativeElement.querySelector(`#datePicker`);
    dataHoraFinalFocused.click()
  }

  setButtonConsultfocus() {
    let dataHoraFinalFocused = this._elementRef.nativeElement.querySelector(`#consultar`);
    dataHoraFinalFocused.focus()
  }
}
