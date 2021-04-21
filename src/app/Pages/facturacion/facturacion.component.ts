import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  templateParent = true;
  facturacionPrimary = 'Facturación'
  facturacionSecond = 'Orden'
  constructor() {
  }

  ngOnInit(): void {
  }

  change() {
    let temp = this.facturacionPrimary;
    this.facturacionPrimary = this.facturacionSecond;
    this.facturacionSecond = temp;
    this.templateParent = !this.templateParent;
  }
}
