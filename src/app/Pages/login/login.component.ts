import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-loggin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogginComponent implements OnInit {

  constructor() { }

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
    }, 2000);

  }

  private error() {
    Swal.fire({
      title: 'Oops... Something went wrong',
      icon: 'error',
      showConfirmButton: false
    })
  }
}
