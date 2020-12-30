import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogginComponent } from './Pages/loggin/loggin.component';
import { HomeComponent } from './Pages/home/home.component';
import { FacturacionComponent } from './Pages/facturacion/facturacion.component';

const routes: Routes = [
  { path: '', component: LogginComponent },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'facturacion', component: FacturacionComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
