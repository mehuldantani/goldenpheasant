import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth : AngularFireAuth) { }

  Signup(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email,password);
  }

  SignIn(email: string, passsword:string){
    return this.auth.signInWithEmailAndPassword(email,passsword);
  }

  getUser(){
    return this.auth.authState;
  }

  SignOut(){
    return this.auth.signOut();
  }

}
