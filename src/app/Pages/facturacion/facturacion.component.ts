import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  templateParent = true;
  facturacionPrimary = 'Factura de Venta MNS 145'
  constructor() {
  }

  ngOnInit(): void {
  }
}
