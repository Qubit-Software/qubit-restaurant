import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogginComponent } from './Pages/login/login.component';
import { HomeComponent } from './Pages/home/home.component';
import { FacturacionComponent } from './Pages/facturacion/facturacion.component';
import { ClientsComponent } from './Pages/clients/clients.component';
import { ReportsComponent } from './Components/Reports/reports/reports.component';
import { BalanceComponent } from './Components/Balance/balance/balance.component';
import { InventarioComponent } from './Components/inventario/inventario.component';

const routes: Routes = [
  { path: '', component: LogginComponent },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'facturacion', component: FacturacionComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'balance', component: BalanceComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }





