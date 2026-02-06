import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PropiedadFormComponent } from './components/propiedad-form/propiedad-form.component';
import { PropiedadDetalleComponent } from './components/propiedad-detalle/propiedad-detalle.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { GastosComponent } from './components/gastos/gastos.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [authGuard] },
  { path: 'gastos', component: GastosComponent, canActivate: [authGuard] },
  { path: 'propiedades/nueva', component: PropiedadFormComponent, canActivate: [authGuard] },
  { path: 'propiedad/:id', component: PropiedadDetalleComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
