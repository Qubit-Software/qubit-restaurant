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
import { MenuTableComponent } from './Components/menuComponents/menu-table/menu-table.component';
import { MenuProductsComponent } from './Components/menuComponents/menu-products/menu-products.component';
import { SettingsMenuComponent } from './Components/menuComponents/settings-menu/settings-menu.component';
import { FacturasComponent } from './Pages/facturas/facturas.component';
import { SettingsComponent } from './Pages/settings/settings.component';
import { MainSettingsComponent } from './Components/settings/main-settings/main-settings.component';
import { PrinterComponent } from './Components/settings/printer/printer.component';

const routes: Routes = [
  { path: '', component: LogginComponent },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'facturas', component: FacturasComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'report', component: ReportComponent },
      { path: 'inventario', component: InventoryComponent },
      {
        path: 'menu', component: MenuComponent, children: [
          { path: 'menuTable', component: MenuTableComponent },
          { path: 'menuProduct', component: MenuProductsComponent },
          { path: 'settings/:id', component: SettingsMenuComponent },
        ]
      },
      {
        path: 'settings', component: SettingsComponent, children: [
          {
            path: 'main', component: MainSettingsComponent, children: [
              { path: 'printer', component: PrinterComponent },
              { path: 'menuTable', component: MenuTableComponent },
              { path: 'menuProduct', component: MenuProductsComponent },
            ]
          }
        ]
      },
    ]
  },
  {
    path: 'main', component: MainComponent, children: [
      {
        path: 'facturacion', component: FacturacionComponent, children: [
          { path: 'menuTable', component: MenuTableComponent },
          { path: 'menuProduct', component: MenuProductsComponent }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }





