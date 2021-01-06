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
    codigo: 'b455645064',
    referencia: 'Saco de lana',
    Marca: 'M',
    Talla: 'M',
    Cantidad: '2',
    Precio: '$20.000',
    precioBase: '$6.233',
    Iva: '5%',
    subtotal: '$26.233'
  }
  //*************************** testing only ***********************************
  page: number = 1;

  constructor() { }

  ngOnInit(): void {

    //*************************** testing only ***********************************
    for (let i = 0; i < 30; i++) {
      this.template.push(this.element)
      //*************************** testing only ***********************************


    }
  }

}
