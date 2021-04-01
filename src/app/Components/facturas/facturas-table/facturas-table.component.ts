import { Component, OnInit } from '@angular/core';
import { FacturasModel } from 'src/app/Models/Facturas';
import { SucursalService } from 'src/app/Services/sucursal.service';
import { VentaService } from 'src/app/Services/venta.service';

@Component({
  selector: 'app-facturas-table',
  templateUrl: './facturas-table.component.html',
  styleUrls: ['./facturas-table.component.css']
})
export class FacturasTableComponent implements OnInit {

  pressed = 1;
  period = 'Diario';
  allFacturas: FacturasModel[];
  facturas: FacturasModel[];
  currentDate = new Date();
  total = 0;

  constructor(private venta: VentaService, private sucursal: SucursalService) { }

  ngOnInit(): void {
    this.currentDate.setHours(0, 0, 0, 0)
    if (this.sucursal.empresa == null) {
      this.sucursal.getSucursalInfo().subscribe(res => {
        this.getVentas();
      });
    } else {
      this.getVentas();
    }

  }
  getVentas() {
    this.allFacturas = new Array();
    this.venta.getVentasBySucursal(this.sucursal.empresa.id).subscribe((res: any[]) => {
      res.forEach(element => {
        let factura = new FacturasModel();
        factura.id = element['id'];
        factura.idFactura = element['factura'];
        factura.fecha = new Date(element['fecha']);
        factura.fecha.setDate(factura.fecha.getDate() + 1);
        factura.fecha.setHours(0, 0, 0, 0)
        factura.metodo = element['tipo'];
        factura.total = element['preciototal'];
        this.allFacturas.push(factura);
      });
      this.day()
    })
  }
  print() {

  }

  change(btn): void {
    this.pressed = btn;
    if (btn === 1) {
      this.day();
      this.period = 'Diario';
    } else {
      this.month();
      this.period = 'Mensual';
    }
  }
  day() {
    this.total = 0;
    let items = this.allFacturas.filter(item => item.fecha.getTime() === this.currentDate.getTime());
    this.facturas = items;
    this.facturas.forEach(fatura => {
      this.total = this.total + (+fatura.total)
    });
  }
  month() {
    this.total = 0;
    let mes = this.currentDate
    mes.setDate(mes.getMonth() - 1)
    console.log()
    let items = this.allFacturas.filter(item => item.fecha >= mes && item.fecha <= this.currentDate);
    this.facturas = items;
    this.facturas.forEach(fatura => {
      this.total = this.total + (+fatura.total)
    });
  }
}
