import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-dark bg-dark sticky-top shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="bi bi-building"></i> InmuebleManager
        </a>
        <div class="d-flex align-items-center" *ngIf="mostrarBotones">
          <span class="text-white me-3" *ngIf="currentUser$ | async as user">
            Bienvenido, {{ user.nombre }}
          </span>
          
          <!-- Dropdown del Perfil -->
          <div class="dropdown" *ngIf="currentUser$ | async as user">
            <button 
              class="btn btn-dark dropdown-toggle d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="bi bi-person-circle me-2"></i>
              {{ user.nombre | slice:0:10 }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg">
              <li>
                <a class="dropdown-item" routerLink="/perfil">
                  <i class="bi bi-person-fill me-2"></i> Mi Perfil
                </a>
              </li>
              <li>
                <a class="dropdown-item" routerLink="/configuracion">
                  <i class="bi bi-gear me-2"></i> Configuración
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
      font-size: 1.3rem;
      transition: transform 0.2s;
    }
    .navbar-brand:hover {
      transform: scale(1.05);
    }
    .dropdown-toggle {
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 0.9rem;
    }
    .dropdown-toggle:hover {
      border-color: rgba(255, 255, 255, 0.5);
      background-color: rgba(255, 255, 255, 0.1);
    }
    .dropdown-menu {
      min-width: 200px;
    }
    .dropdown-item {
      padding: 0.6rem 1rem;
      font-size: 0.95rem;
    }
    .dropdown-item:hover {
      background-color: f8f9fa;
    }
    .dropdown-item.text-danger:hover {
      background-color: #ffe5e5;
    }
  `],
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  currentUser$: Observable<any>;
  isAuthenticated = false;
  mostrarBotones = true;

  constructor(private authService: AuthService, private router: Router) {
    // Inicializar currentUser$ con el observable del servicio
    this.currentUser$ = this.authService.currentUser$;
    
    // Suscribirse a cambios del usuario autenticado
    this.currentUser$.subscribe((user: any) => {
      this.isAuthenticated = !!user && !!user.id;
    });

    // Escuchar cambios de ruta para ocultar botones en login/registro
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.mostrarBotones = !(url.includes('/login') || url.includes('/registro'));
    });
  }

  ngOnInit() {
    // Restaurar usuario del localStorage al inicializar
    // Ahora valida contra el backend
    this.authService.restoreUserFromStorage().subscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
