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
  users = [];

  activityLogs = this._formBuilder.group({
    nomeUsuario: [''],
    data: [''],
  });

  constructor(
    private titleService: Title,
    private userLoggedService: UserLoggedService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Registro de atividades manuais');

    this.getUsersLogged();
  }

  getUsersLogged() {
    this.userLoggedService.getUsers().subscribe((response) => {
      this.users = response.itens.sort((a, b) => a.nome.localeCompare(b.nome));

      let user = localStorage.getItem('__authenticationUserData__');

      this.activityLogs.get('nomeUsuario').setValue(user);
    });
  }
}
