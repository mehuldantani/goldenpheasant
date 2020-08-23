import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from './../../services/auth.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f:NgForm){
    const {email,password} = f.form.value;

    this.auth.SignIn(email,password)
    .then((res)=>{
      this.toastr.success("Login Success");
      this.router.navigateByUrl("/home");
    })
    .catch((error)=>{
      console.log(error);
      this.toastr.warning("SignIn Failed","",{
        closeButton: true
      })
      
    })


  }

}
