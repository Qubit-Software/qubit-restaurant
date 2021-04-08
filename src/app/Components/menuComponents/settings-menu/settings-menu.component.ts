import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { CategoriaModel } from 'src/app/Models/Categorias';
import { ProductModel } from 'src/app/Models/Products.js';
import { MenuService } from 'src/app/Services/menu.service.js';
import { SucursalService } from 'src/app/Services/sucursal.service.js';
import Swal from 'sweetalert2';
import * as config from '../../../../config/config.js';


@Component({
  selector: 'app-create-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.css']
})
export class SettingsMenuComponent implements OnInit {

  faChevronLeft = faChevronLeft;
  categoriasData: CategoriaModel[];
  allProductsData: ProductModel[];
  producto: ProductModel = new ProductModel();
  idProd: string;
  descripcionSettings: string;
  iconViewSrc: string = "../../../../assets/images/iconos/eye.png";
  boolSettings: boolean;

  constructor(private menu: MenuService, private router: Router, private route: ActivatedRoute, private sucursal: SucursalService) {
    menu.menuData$.subscribe((newMenu: ProductModel[]) => {
      this.allProductsData = newMenu;
    })
  }

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
    this.idProd = this.route.snapshot.paramMap.get("id");
    if (this.idProd !== "new") {
      this.descripcionSettings = "Actualizacion de menú";
      this.boolSettings = false;
      this.llenaProduct();
    } else {
      this.descripcionSettings = "Registro de menú";
      this.producto.visible = true;
      this.boolSettings = true;
    }
  }
  llenaProduct() {
    if (this.allProductsData != null) {
      this.producto = this.allProductsData.find(item => item.id == (+this.idProd));
      if (this.producto == null) {
        this.router.navigate(['../../menuTable'], { relativeTo: this.route });
      } else {
        let indexCat = this.categoriasData.findIndex(item => item.id == (+this.producto.categoria));
        [this.categoriasData[0], this.categoriasData[indexCat]] = [this.categoriasData[indexCat], this.categoriasData[0]];
      }
    } else {
      this.menu.getAllMenu().subscribe(res => {
        this.producto = this.allProductsData.find(item => item.id == (+this.idProd));
        if (this.producto == null) {
          this.router.navigate(['../../menuTable'], { relativeTo: this.route });
        } else {
          let indexCat = this.categoriasData.findIndex(item => item.id == (+this.producto.categoria));
          [this.categoriasData[0], this.categoriasData[indexCat]] = [this.categoriasData[indexCat], this.categoriasData[0]];
        }
      });
    }
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
        this.router.navigate(['../../menuTable'], { relativeTo: this.route });
      }
    });
  }
  guardar() {
    let precio = this.producto.precio.replace("$", "").replace(".", "");
    if (precio == "" || precio == "0" || this.producto.nombre == "") {
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
      this.menu.createMenu(this.categoriasData[0].id, this.producto.nombre, precio, true).subscribe(res => {
        this.menu.getAllMenu().subscribe(res => {
          Swal.close();
          this.producto = new ProductModel();
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
  actualizar() {
    let precio = this.producto.precio.replace("$", "").replace(".", "");
    if (precio == "" || precio == "0" || this.producto.nombre == "") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor verifica los datos',
        confirmButtonText: 'Ok',
      });
      return
    } else {
      Swal.fire({
        title: '¿Realmente desea actualizar el menú?',
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
          this.menu.updateMenu(this.producto.id, this.categoriasData[0].id, this.producto.nombre, precio, this.producto.visible).subscribe(res => {
            this.menu.getAllMenu().subscribe(res => {
              console.log(this.menu);
              Swal.close();
              Swal.fire('Menu actualizado', '', 'success');
              this.router.navigate(['../../menuTable'], { relativeTo: this.route });
            }, (err) => {
              Swal.close();
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Se ha presentado un error inesperado'
              });
              console.log(err);
            })
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
      });
    }
  }
  eliminar() {
    if (localStorage.getItem('empresaId') == null) {
      this.sucursal.getSucursalInfo().subscribe(res => {
        this.deleteMenu();
      });
    } else {
      this.deleteMenu();
    }
  }
  deleteMenu() {
    Swal.fire({
      title: '¿Realmente desea eliminar el menú?',
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
        this.menu.deleteOne(this.producto.id, localStorage.getItem('empresaId')).subscribe(res => {
          this.menu.getAllMenu().subscribe(res => {
            console.log(this.menu);
            Swal.close();
            Swal.fire('Menu actualizado', '', 'success');
            this.router.navigate(['../../menuTable'], { relativeTo: this.route });
          }, (err) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Se ha presentado un error inesperado'
            });
            console.log(err);
          })
        }, (err) => {
          if (err['error']['msg'] == 'MenuIsUsed') {
            Swal.close();
            Swal.fire({
              icon: 'warning',
              title: 'Este producto ya ha sido vendido',
              text: 'Esto puede generar error en la base de datos, se recomienda actualizar la visualización del producto'
            });
          } else {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Se ha presentado un error inesperado'
            });
            console.log(err);
          }
        })
      }
    });
  }
}
