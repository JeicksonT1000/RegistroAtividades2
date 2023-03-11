import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { MessageService } from 'src/app/services/message.service';
import { RecordTasksService } from 'src/app/services/record-tasks.service';
import { UserLoggedService } from 'src/app/services/user-logged.service';
import { ModalActivityDoneComponent } from '../modal-activity-done/modal-activity-done.component';

@Component({
  selector: 'app-activities-timer',
  templateUrl: './activities-timer.component.html',
  styleUrls: ['./activities-timer.component.css']
})
export class ActivitiesTimerComponent implements OnInit {
  users = [];
  activities = [];
  counter = 0
  runClock = null;
	running = false;
  activity = null
  timer = String(moment().hour(0).minute(0).second(0).format("00 : 00 : 00"))
  horasTrabalhadas = 0
  countTimer = moment().hour(0).minute(0).second(0)
  stopTimer = false
  
  // Tempo trabalhado
  workedTime = undefined;

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
    public messageService: MessageService,
    private _elementRef : ElementRef,
    public dialog: MatDialog,
  ) { }
  

  ngOnInit(): void {
    this.titleService.setTitle('Countador de atividades');

    this.recordActivities();

    setTimeout(() => {
      let focusedTaskDescription = this._elementRef.nativeElement.querySelector(`#taskID-panel-timer`);
      focusedTaskDescription.click()    
    }, 600)
  }

  openModalActivityDone(activity): void {
    this.dialog.open(ModalActivityDoneComponent)
    localStorage.setItem('__userId__', JSON.stringify(activity))
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

    data.forEach(item => {
      this.horasTrabalhadas = item.horasTrabalhadas
    })  

    setTimeout(() => {
      this.activities.push(...data)
     }, 500)
    })
  }

  convertDecimalToTime(hour = 0) {
    return this.msToTime(hour * 1000 * 60 * 60);
  };

  msToTime(duration) {

    var min = '';

    if (duration < 0) {
      duration = duration * (-1);
      min = '-';
    }

    var seconds = parseInt(String(((duration / 1000) % 60)))
    var minutes = parseInt(String((duration / (1000 * 60)) % 60))
    var hours = parseInt(String((duration / (1000 * 60 * 60))));

    hours = (hours < 10) ? hours : hours;
    minutes = (minutes < 10) ? minutes : minutes;
    seconds = (seconds < 10) ? seconds : seconds;

    return  min + hours + ':' + minutes + ':' + seconds;
  };

  clearTime() {
    this.counter = 0
  }

  stopwatch(activity) { 
    this.timer = String(moment(this.countTimer).add(this.counter++, 'seconds').format("HH : mm : ss"))
    
    this.workedTime = moment(this.workedTime).add(1, 'seconds');

    // if (!this.horasTrabalhadas)
    //   this.horasTrabalhadas = activity.horasTrabalhadas;
    // activity.horasTrabalhadas = (Math.abs(Number(this.timer)) / 1000 / 60 / 60) + this.horasTrabalhadas;
  };


  // Inicia o cronometro com a tarefa
  startActivity(activity) {
    if(this.runClock === null && this.running === false) {
      this.clearTime()

      this.runClock = setInterval(() => {
        this.stopwatch(activity)
      }, 1000)

      this.running = true
    }

    activity.datahorainicio = new Date()

    this.recordeTasksService.getTimerTask(activity.id).subscribe(() => {
      this.messageService.showMessage('A atividade #' + activity.id + ' foi iniciada.')
    })
  }

  pauseActivity(activity) {
    clearInterval(this.runClock);
    this.runClock = null;
    this.running = false;

    this.recordeTasksService.updateTimerTask(activity).subscribe(() => {

      this.messageService.showMessage('A atividade #' + activity.id + ' foi pausada.')

      this.clearTime()
    })
  }

  ngDoCheck() {
    let reload = JSON.parse(localStorage.getItem('__reloadPage__'))

    if(!!reload && reload === true) {
      setTimeout(() => {
        window.location.reload()
      }, 100)

      setTimeout(() => {
        localStorage.removeItem('__reloadPage__')
      }, 150)
    }
  }
}
