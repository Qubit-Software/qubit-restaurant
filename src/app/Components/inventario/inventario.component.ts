import { Component, OnInit } from '@angular/core';
import { InventarioService } from 'src/app/Services/inventario.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  constructor(private inventarioService: InventarioService) { }

  ngOnInit(): void {
    this.inventarioService.getFirebaseInventario().subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    })
  }

}
