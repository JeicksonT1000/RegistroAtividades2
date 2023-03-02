import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RecordTasksService } from 'src/app/services/record-tasks.service';
import { UserLoggedService } from 'src/app/services/user-logged.service';

@Component({
  selector: 'app-activities-timer',
  templateUrl: './activities-timer.component.html',
  styleUrls: ['./activities-timer.component.css']
})
export class ActivitiesTimerComponent implements OnInit {
  users = [];
  activities = [];

  activityLogs = this._formBuilder.group({
    nomeUsuario: [''],
    datePicker: ['', [Validators.required]],
    dataHoraInicio: ['', [Validators.required]],
    dataHoraFim: ['', [Validators.required]],
    taskID: ['', [Validators.required]]
  });

  constructor(
    private titleService: Title,
    private _formBuilder: FormBuilder,
    private userLoggedService: UserLoggedService,
    private recordeTasksService: RecordTasksService,

  ) { }
  

  ngOnInit(): void {
    this.titleService.setTitle('Registro de atividades manuais');

    this.recordActivities();
  }

  getUsersLogged() {
    this.userLoggedService.getUsers().subscribe((response) => {
      this.users = response.itens.sort((a, b) => a.nome.localeCompare(b.nome));

      let user = localStorage.getItem('__authenticationUserData__');

      this.activityLogs.get('nomeUsuario').setValue(user);
    });
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

}
