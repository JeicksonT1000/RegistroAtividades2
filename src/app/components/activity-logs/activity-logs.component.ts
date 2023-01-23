import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserLoggedService } from 'src/app/services/user-logged.service';

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.css'],
})
export class ActivityLogsComponent implements OnInit {
  constructor(
    private titleService: Title,
    private userLoggedService: UserLoggedService 
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Registro de atividades manuais');

    this.getUsersLogged()
  }

  getUsersLogged() {
    this.userLoggedService.getUsers().subscribe((response) => {
      console.log(response)
    })
  }
}
