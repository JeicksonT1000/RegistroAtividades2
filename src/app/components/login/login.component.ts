import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  creds = this._formBuilder.group({
    usuario: ['', Validators.required],
    senha: ['', Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLogged();
  }

  signin = (creds) => {
    if (!creds.valid) return;

    this.service.token(creds.value).subscribe((response) => {
      localStorage.setItem('__authenticationToken__', response.access_token);

      localStorage.setItem(
        '__authenticationUserData__',
        creds.controls['usuario'].value
      );

      this.router.navigate(['registro-atividades']);
    });
  };

  isLogged = () => {
    let token = localStorage.getItem('__authenticationToken__');

    if (token) this.router.navigate(['registro-atividades']);
  };
}
