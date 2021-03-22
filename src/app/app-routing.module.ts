import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogginComponent } from './Pages/login/login.component';
import { HomeComponent } from './Pages/home/home.component';
import { FacturacionComponent } from './Pages/facturacion/facturacion.component';
import { ClientsComponent } from './Pages/clients/clients.component';
import { ReportComponent } from './Pages/report/report.component';
import { InventoryComponent } from './Pages/inventory/inventory.component';
import { MainComponent } from './Pages/main/main.component';
import { MenuComponent } from './Pages/menu/menu.component';

const routes: Routes = [
  { path: '', component: LogginComponent },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'facturacion', component: FacturacionComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'report', component: ReportComponent },
      { path: 'inventario', component: InventoryComponent },
      { path: 'menu', component: MenuComponent },
    ]
  },
  {
    path: 'main', component: MainComponent, children: [
      { path: 'facturacion', component: FacturacionComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }





