import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './components/usuarios/components/usuarios/usuarios.component';
import { LoginComponent } from './components/login/login.component';
import { UsuariosService } from './services/usuarios.service';
import { UsuariodetalleComponent } from './components/usuariodetalle/usuariodetalle.component';

//Importamos ngBootstrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
//Importamos reactiveForms
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    UsuariosComponent,
    LoginComponent,
    UsuariodetalleComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    NgbModule,
    UsuariosRoutingModule
  ],
  providers: [
    UsuariosService
  ]
})
export class UsuariosModule { }
