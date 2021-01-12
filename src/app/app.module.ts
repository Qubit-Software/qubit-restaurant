import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './Components/nav-menu/nav-menu.component';
import { LogginComponent } from './Pages/login/login.component';
import { HomeComponent } from './Pages/home/home.component';
import { FacturacionComponent } from './Pages/facturacion/facturacion.component';
import { ClientesComponent } from './Components/clientes/clientes/clientes.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FacturaProductoComponent } from './Components/factura-producto/factura-producto.component';
import { ClientsComponent } from './Pages/clients/clients.component';
import { ClientTableComponent } from './Components/clientes/client-table/client-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportsComponent } from './Components/Reports/reports/reports.component';
import { ChartsModule } from 'ng2-charts';
import { BalanceComponent } from './Components/Balance/balance/balance.component';



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
    ClientTableComponent,
    ReportsComponent,
    BalanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxPaginationModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
