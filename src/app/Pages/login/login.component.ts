import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/Models/User';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

=======
import Swal from 'sweetalert2';
>>>>>>> d4d606171b1abbc4a9111b5fc5319d57d481ee1b
@Component({
  selector: 'app-loggin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogginComponent implements OnInit {

  usuario: UserModel = new UserModel();
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.login();
  }
  private login() {
    Swal.fire({
      allowOutsideClick: false,
      title: 'Espere por favor'
    });
    Swal.showLoading();
    setTimeout(() => {
      Swal.close();
      this.error();
      setTimeout(() => {
        Swal.close();
      }, 2000);
    }, 200000);

  }

  login(form: NgForm): void {

    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(resp => {
      Swal.close();
      this.router.navigateByUrl('/home/facturacion');
    }, (err) => {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: 'Revisa tus credenciales antes de acceder'
      });
      console.log(err);
    });
  }
}
