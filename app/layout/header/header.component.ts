import { Component, OnInit } from '@angular/core';
import {AuthService} from './../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {faKiwiBird} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faKiwiBird = faKiwiBird;
  email = null;
  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService
  ) { 
    auth.getUser().subscribe((user)=>{
      this.email = user?.email;
    })
  }

  ngOnInit(): void {
  }

  async handleSignOut(){
    try {
    await this.auth.SignOut();
      this.toastr.success("Login Again to See the World");
      this.router.navigateByUrl('/signin');
      this.email = null;
    } catch (error) {
      console.log(error);
      this.toastr.warning("Please try again");
    }
  }

}
