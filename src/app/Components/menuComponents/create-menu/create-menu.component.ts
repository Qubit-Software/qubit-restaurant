import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { CategoriaModel } from 'src/app/Models/Categorias';
import { MenuService } from 'src/app/Services/menu.service.js';
import Swal from 'sweetalert2';
import * as config from '../../../../config/config.js';


@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.css']
})
export class CreateMenuComponent implements OnInit {

  faChevronLeft = faChevronLeft;
  categoriasData: CategoriaModel[];
  precio: string = "";
  descripcion: string = "";

  constructor(private menu: MenuService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    $(".recibeInput").on({
      "focus": function (event) {
        $(event.target).select();
      },
      "keyup": function (event) {
        $(event.target).val(function (index, value) {
          return "$" + value.replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
        });
      }
    });
    this.llenaCategorias();
  }

  llenaCategorias() {
    this.categoriasData = new Array();
    let res = config['configValue']['categorias']
    Object.keys(res).map(key => {
      let categoria = new CategoriaModel();
      let spliNombre = key.split('-');
      categoria.id = +spliNombre[0];
      categoria.nombre = spliNombre[1];
      categoria.imagen = res[key];
      this.categoriasData.push(categoria);
    });
  }

  change(i: number) {
    [this.categoriasData[0], this.categoriasData[i]] = [this.categoriasData[i], this.categoriasData[0]];
  }
  atras() {
    Swal.fire({
      title: '¿Realmente desea salir de la configuracion del menú?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Salir`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['../menuTable'], { relativeTo: this.route });
      }
    });
  }
  guardar() {
    let precio = this.precio.replace("$", "").replace(".", "");
    if (precio == "" || precio == "0" || this.descripcion == "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor verifica los datos',
        confirmButtonText: 'Ok',
      });
      return
    } else {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor'
      });
      this.menu.createMenu(this.categoriasData[0].id, this.descripcion, precio).subscribe(res => {
        this.menu.getAllMenu().subscribe(res => {
          Swal.close();
          this.descripcion = ""
          this.precio = "0";
          Swal.fire('Menu actualizado', '', 'success')
        }, (err) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se ha presentado un error inesperado'
          });
          console.log(err);
        });
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
  }

}
