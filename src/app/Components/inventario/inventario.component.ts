import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { InventarioService } from 'src/app/Services/inventario.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  columns = new Array();
  columnsKey = new Array();
  posAdd = false;
  form: FormGroup;
  faPlus = faPlus;
  searchText: string;
  inventario = new Array();
  newInventario: { [k: string]: any } = {};
  page: number = 1;
  edit: number = -1;
  editIcon = '../../../../assets/images/iconos/edit-button.png';
  checkIcon = '../../../../assets/images/iconos/checked.png';
  constructor(private inventarioService: InventarioService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getColumns();
    this.getInventario();
  }
  getColumns() {
    this.inventarioService.getFirebaseInventario().subscribe(async (res: any[]) => {
      const ordered = Object.keys(res).sort().reduce(
        (obj, key) => {
          obj[key] = res[key];
          return obj;
        },
        {}
      );
      this.columns = Object.keys(ordered).map(key => ordered[key]);
      this.columnsKey = await Object.keys(ordered).map(key => {
        let split = key.split("-");
        return split[1];
      });
      this.llenaNewInventario(this.columnsKey);
    }, err => {
      console.log(err);
    })
  }
  llenaNewInventario(columnsKeys: any[]) {
    columnsKeys.forEach(element => {
      this.newInventario[`${element}`] = '';
    });
  }
  getInventario() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();
    this.inventarioService.getAllInventario().subscribe((res: any[]) => {
      this.inventario = res['inventario'];
      this.inventario.unshift(this.newInventario);
      console.log(this.inventario);
      Swal.close();
    }, err => {
      this.inventario = new Array();
      Swal.close();
      console.log(err);
    })
  }
  disabledEdit(index) {
    this.edit = index;
  }
  CreateInventario(index) {
    if (!this.posAdd) {
      this.posAdd = !this.posAdd;
      this.edit = index;
    } else {
      this.createForm(this.inventario[index]);
      console.log(this.form);
      if (this.form.invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor verifica los datos',
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cerrar edición',
        }).then((result) => {
          if (result.isConfirmed) {

          } else if (result.dismiss) {
            this.llenaNewInventario(this.columnsKey);
            this.getInventario();
            this.edit = -1;
          }
        })
        return;
      }
      Swal.fire({
        title: '¿Desea guardar los cambios?',
        icon: 'warning',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Guardar`,
        denyButtonText: `No guardar`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'info',
            text: 'Espere por favor'
          });
          Swal.showLoading();
          this.inventarioService.createInventario(this.inventario[index]).subscribe(res => {
            Swal.close();
            Swal.fire('Inventario actualizado', '', 'success');
            this.llenaNewInventario(this.columnsKey);
            this.getInventario();
            this.edit = -1;
          }, (err) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Se ha presentado un error inesperado'
            });
            this.llenaNewInventario(this.columnsKey);
            this.getInventario();
            this.edit = -1;
            console.log(err);
          });
        } else if (result.isDenied) {
          this.getInventario();
          this.edit = -1;
        }
      })
    }
  }
  updateConsumidor(index) {
    this.createForm(this.inventario[index]);
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor verifica los datos',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cerrar edición',
      }).then((result) => {
        if (result.isConfirmed) {

        } else if (result.dismiss) {
          this.getInventario();
          this.edit = -1;
        }
      })
      return;
    }
    Swal.fire({
      title: '¿Desea guardar los cambios?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Guardar`,
      denyButtonText: `No guardar`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor'
        });
        Swal.showLoading();
        this.inventarioService.updateInventario(this.inventario[index]).subscribe(res => {
          Swal.close();
          Swal.fire('Inventario actualizado', '', 'success')
          this.edit = -1;
        }, (err) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se ha presentado un error inesperado'
          });
          console.log(err);
        });
        this.edit = -1;
      } else if (result.isDenied) {
        this.getInventario();
        this.edit = -1;
      }
    })
  }
  createForm(inventario: Object) {
    this.form = this.fb.group({});
    Object.keys(inventario).map((key) => {
      this.form.addControl(key, new FormControl(inventario[key], Validators.required));
    });
  }
  deleteConsumidor(index) {
    Swal.fire({
      title: '¿Desea eliminar el inventario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor'
        });
        Swal.showLoading();
        this.inventarioService.deleteOne(this.inventario[index].id).subscribe(res => {
          Swal.close();
          Swal.fire('Inventario eliminado', '', 'success');
          this.inventario.splice(index, 1);
        }, (err) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se ha presentado un error inesperado'
          });
          console.log(err);
        });
      }
    })
  }
}
