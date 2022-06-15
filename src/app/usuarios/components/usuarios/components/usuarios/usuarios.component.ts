import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.service';
import { Router } from '@angular/router';
import { UsuariosI } from 'src/app/usuarios/models/usuarios';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//importamos los validadores personalizados para validar el password y confirmar que coincidan 
import { MustMatch } from '../../helpers/must-match.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  closeResults:string = '';
  public usuarios:any =[];
  public registerForm: FormGroup | any;
  public updateForm: FormGroup | any;
  public submited = false;
  public user:UsuariosI | any;

  constructor(private usuariosService: UsuariosService,
    private router: Router,
    public modal: NgbModal,
    public modalDelete: NgbModal,
    public modalUpdate: NgbModal,
    private formBuilder: FormBuilder,
    private formBuilderUpdate: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      passwordconfirm: ['',Validators.required],
      tipo: ['',Validators.required]
    },
    {
      validator: MustMatch('password','passwordconfirm')
    }
    );
    this.updateForm = this.formBuilderUpdate.group({
      _id: [''],
      name: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      passwordconfirm: ['',Validators.required],
      tipo: ['',Validators.required]
    });
    this.getUsuarios();
  }
  //Metodo getter para un facil acceso a los campos del formulario
  get fields(){ return this.registerForm?.controls;}

  getUsuarios(){
    this.usuariosService.getUsers()
        .subscribe(response =>{
         console.log('llamada a getUsuarios');
         this.usuarios = response as UsuariosI[];
    })
  }
  mostrarUsuarios(_id: any){
    this.router.navigate(['usuarios/'+_id])
  }
  
  open(content:any){
    this.registerForm.reset();
    this.modal.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result)=>{
      this.closeResults = `Closed with: ${result}`; 
    }, (reason) =>{
      this.closeResults = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string{
    if (reason === ModalDismissReasons.ESC){
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK){
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }//fin de getDismissReason

  onSubmit(){
    this.submited = true;

    //Detenemos la ejecusion si la forma es invalida
    if (this.registerForm.controls["name"].status == "INVALID" ||
        this.registerForm.controls["email"].status == "INVALID" ||
        this.registerForm.controls["password"].status == "INVALID" ||
        this.registerForm.controls["passwordconfirm"].status == "INVALID"){
      return;
    }
    //console.log(this.registerForm.value);
    let usuario: UsuariosI = {
      _id: this.registerForm.value.id,
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      tipo: this.registerForm.value.tipo
    }
    this.usuariosService.addUser(usuario)
        .subscribe( res =>{
          if (res.hasOwnProperty('message')){
            let error: any = res;
            if(error.message == 'Error user exists'){
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error, el email ya esta en uso, porfavor utilice otro!',
                confirmButtonColor: '#A1260C'
              });
              return;
            }//Usuario Existe
          }//res.hasOwnPropety
          //No existe el error al registrar el usuario
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Usuario Registrado de manera exitosa',
            confirmButtonColor: '#3FEE0A'
          });
          this.getUsuarios;
          this.registerForm.reset();
          this.modal.dismissAll();
  })
  }//Fin de OnSubmit
  abrirModalEliminar(id:string, modalname: any){
    this.usuariosService.getUser(id)
          .subscribe( res=>{
              this.user = res as UsuariosI;
          })
      this.modalDelete.open(modalname, {size: 'sm'}).result.then( (res)=>{
        this.closeResults = `Close with: ${res}`;
      },(reason)=>{
        this.closeResults = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }//fin del metodo abrilModalEliminar
      deleteUser(id:string){
       //console.log(id);
       this.usuariosService.removeUser(id)
              .subscribe(res =>{
                this.getUsuarios();
                this.modalDelete.dismissAll();
                Swal.fire({
                  icon: 'success',
                  title: 'Eliminada',
                  text: 'Usuario Eliminado',
                  confirmButtonColor: '#3FEE0A'
                });
              })
      }//Fin del metodo deleteUser

      modificarUsuario(usuario: any,modal:any){
        console.log(usuario);
        this.updateForm = this.formBuilder.group({
        _id:[usuario._id],
        name: [usuario.name,Validators.required],
        email: [usuario.email, [Validators.required, Validators.email, Validators.min(2)]],
        password: ['', [Validators.required,Validators.minLength(6), Validators.min(2)]],
        tipo: [Validators.required, Validators.min(1)]
        });
        this.modal.open(modal,{size:'sm'}).result.then((result)=>{
          this.closeResults = `Closed with: ${result}`;
  
        }, (reason)=>{
          this.closeResults = `Dimissed ${this.getDismissReason(reason)}`;
        });
      }
      updateSubmit(){
        if(this.updateForm.invalid){
          return;
        }
        let usuario={
          _id:'',
          name: '',
          email:'',
          password:'',
          tipo: 0
        }
        usuario.name = this.updateForm.value.name;
        usuario.email = this.updateForm.value.email;
        usuario.password = this.updateForm.value.password;
        usuario.tipo = this.updateForm.value.tipo;
        console.log(usuario);
        this.usuariosService.updateUser(this.updateForm.value._id, usuario)
        .subscribe(response=>{
          console.log(this.updateForm.value._id);
          console.log(response);
          Swal.fire({
            icon: 'success',
            text: 'Usuario actualizado correctamente',
            confirmButtonColor: '#30A10C',
          })
          this.getUsuarios();
          this.modalUpdate.dismissAll();
        })
        console.log(this.updateForm.value);
      }//fin del metodo updateSub
      cancelUpdate(){
        this.modalUpdate.dismissAll();
      }
  }//Fin del metodo modificarUsuario