import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


isLoading = false;
users;
posts;
  constructor(
    private db : AngularFireDatabase,
    private toastr: ToastrService
  ) {
    this.isLoading = true;

    //fetch all users from firebase
    this.db.object('/Users')
    .valueChanges()
    .subscribe((obj)=>{
      if(obj){
        this.users = Object.values(obj);
        console.log(this.users);
        
        this.isLoading = false;
      }
      else{
        this.users =[];
        this.isLoading = false;
      }
    });

    //fetch all post from firebase
    this.db.object('/posts')
    .valueChanges()
    .subscribe((obj)=>{
      if(obj){
        this.posts = Object.values(obj).sort((a,b)=> b.date-a.date);
        this.isLoading = false;
        console.log(this.posts);
        
      }
      else{
        this.posts =[];
        this.toastr.warning("No Post Available");
      }
    })
   }

  ngOnInit(): void {
  }

}
