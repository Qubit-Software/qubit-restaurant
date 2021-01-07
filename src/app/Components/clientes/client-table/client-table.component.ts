import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.css']
})
export class ClientTableComponent implements OnInit {


  //*************************** testing only ***********************************

  template: any[] = []
  element = {
    codigo: 2,
    referencia: 'Saco de lana',
    Marca: 'M',
    Talla: 'M',
    Cantidad: '2',
    Precio: '$20.000',
    precioBase: '$6.233',
    Iva: '5%',
    subtotal: '$26.233'
  }
  //*************************** testing only ends***********************************
  page: number = 1;

  constructor() { }

  ngOnInit(): void {

    //*************************** testing only ***********************************
    for (let i = 0; i < 30; i++) {
      this.element['codigo']=0;
      this.template.push(this.element)
      this.element['codigo'] = Math.random() * (1000000 - 1000) + 1000;
      //*************************** testing only  ends***********************************

      console.log(this.element['codigo']);
    }
  }

}
