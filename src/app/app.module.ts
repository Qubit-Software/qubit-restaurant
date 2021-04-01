import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './Components/nav-menu/nav-menu.component';
import { LogginComponent } from './Pages/login/login.component';
import { HomeComponent } from './Pages/home/home.component';
import { FacturacionComponent } from './Pages/facturacion/facturacion.component';
import { ClientesComponent } from './Components/clientes/clientes/clientes.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FacturaProductoComponent } from './Components/facturas/factura-producto/factura-producto.component';
import { ClientsComponent } from './Pages/clients/clients.component';
import { ClientTableComponent } from './Components/clientes/client-table/client-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportsComponent } from './Components/Reports/reports/reports.component';
import { ChartsModule } from 'ng2-charts';
import { BalanceComponent } from './Components/Balance/balance/balance.component';
import { FilterPipe } from './filter.pipe';
import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { InventarioComponent } from './Components/inventario/inventario.component';
import { ReportComponent } from './Pages/report/report.component';
import { InventoryComponent } from './Pages/inventory/inventory.component';
import { MainComponent } from './Pages/main/main.component';
import { MenuComponent } from './Pages/menu/menu.component';
import { MenuTableComponent } from './Components/menuComponents/menu-table/menu-table.component';
import { MenuProductsComponent } from './Components/menuComponents/menu-products/menu-products.component';
import { NavOrderComponent } from './Components/order/nav-order/nav-order.component';
import { CurrencyPipe } from '@angular/common';
import { CreateMenuComponent } from './Components/menuComponents/create-menu/create-menu.component';
import { FacturasComponent } from './Pages/facturas/facturas.component';
import { FacturasTableComponent } from './Components/facturas/facturas-table/facturas-table.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LogginComponent,
    HomeComponent,
    FacturacionComponent,
    ClientesComponent,
    FacturaProductoComponent,
    ClientsComponent,
    FilterPipe,
    ClientTableComponent,
    ReportsComponent,
    ReportComponent,
    BalanceComponent,
    InventarioComponent,
    InventoryComponent,
    MainComponent,
    MenuComponent,
    MenuTableComponent,
    MenuProductsComponent,
    NavOrderComponent,
    CreateMenuComponent,
    FacturasComponent,
    FacturasTableComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxPaginationModule,
    ChartsModule,
  ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
