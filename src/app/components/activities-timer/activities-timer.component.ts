import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { MessageService } from 'src/app/services/message.service';
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
  counter = 0
  runClock = null;
	running = false;
  activity = null
  timer = String(moment().hour(0).minute(0).second(0).format("00 : 00 : 00"))
  horasTrabalhadas 
  countTimer = moment().hour(0).minute(0).second(0)

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
    public messageService: MessageService

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
    this.timer = String(moment(this.countTimer).add(this.counter++, 'seconds').format("HH:mm:ss"))
    
    this.workedTime = moment(this.workedTime).add(1, 'seconds');

    if (!this.horasTrabalhadas)
      this.horasTrabalhadas = activity.horasTrabalhadas;
    activity.horasTrabalhadas = (Math.abs(Number(this.timer)) / 1000 / 60 / 60) + this.horasTrabalhadas;
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

    activity.dataHoraInicio = new Date()

    this.recordeTasksService.getTimerTask(activity.id).subscribe(() => {
    this.messageService.showMessage(" Tarefa iniciada")
    })
  }

  pauseActivity(activity) {
    
  }

  doneActivity(activity) {
    
  }

}
