import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrinterService } from 'src/app/Services/printer.service';
import Swal from 'sweetalert2';
import { ValidatorsFunctions } from 'src/app/helpers/validators';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.css']
})
export class PrinterComponent implements OnInit {

  tipo: string;
  tittle: string;
  printers: object[] = new Array();
  nombre: string;
  constructor(private router: Router, private route: ActivatedRoute, private printer: PrinterService) { }

  ngOnInit(): void {
    this.configModal();
    this.getPrinters();
  }
  configModal() {
    this.tipo = history.state.type;
    if (this.tipo == 'add') {
      this.tittle = 'Agregar impresora';
    }
    if (this.tipo == 'update') {
      this.tittle = 'Actualizar impresora';
    }
    if (this.tipo == 'delete') {
      this.tittle = 'Eliminar impresora';
    }
    if (this.tipo == null) {
      this.closeModal()
    }
  }
  getPrinters() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    this.printer.getPrinters().subscribe(res => {
      if (res['length'] != 0) {
        let i = 0;
        res['printers'].forEach(element => {
          i++;
          let print = {
            "index": i,
            "deviceAddress": element
          };
          this.printers.push(print);
        });
      }
      Swal.close();
    }, (err) => {
      Swal.close();
      console.log(err);
    });
  }
  change(i: number) {
    [this.printers[0], this.printers[i]] = [this.printers[i], this.printers[0]];
  }
  createPrinter() {
    if (this.printers.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha encontrado alguna impresora conectada',
        confirmButtonText: 'Ok',
      });
      return
    }
    if (this.nombre == "" || this.nombre == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor verifica los datos',
        confirmButtonText: 'Ok',
      });
      return
    }
    Swal.fire({
      title: '¿Realmente desea agregar el dispositivo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Aceptar`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor'
        });
        if (ValidatorsFunctions.validateIdEmpresa()) {
          let idSucursal = localStorage.getItem('sucursalId');
          this.printer.createPrinter(this.nombre, this.printers[0]['deviceAddress'], idSucursal).subscribe(res => {
            Swal.close();
            Swal.fire('Impresora agregada', '', 'success');
            this.closeModal();
          }, (err) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Se ha presentado un error inesperado'
            });
            console.log(err);
          });
        } else {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se ha presentado un error inesperado'
          });
        }
      }
    });
  }
  printTest() {
    if (this.printers.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha encontrado alguna impresora conectada',
        confirmButtonText: 'Ok',
      });
      return
    }
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    this.printer.getTest(this.printers[0]['deviceAddress']).subscribe(res => {
      if (res['ok']) {
        Swal.close();
        Swal.fire('Ticket impreso',
          'El ticket se ha dispensado con exito',
          'success');
      } else {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res['msg']
        });
      }
    }, (err) => {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encuentra la impresora conectada'
      });
      console.log(err);
    });
  }
  closeModal() {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("menuModal").style.display = "none"
    document.getElementById("menuModal").className += document.getElementById("menuModal").className.replace("show", "")
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
