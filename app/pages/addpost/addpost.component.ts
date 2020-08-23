import { Component, OnInit } from '@angular/core';


import {ToastrService, ToastRef} from 'ngx-toastr';
import {AuthService} from './../../services/auth.service';
import {Router} from '@angular/router'

//ng forms
import {NgForm} from '@angular/forms';
import {finalize} from 'rxjs/operators'
//for firebase storage
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireDatabase} from '@angular/fire/database';

//browser image resizer to compress image
import {readAndCompressImage} from 'browser-image-resizer';
import {imgconfig} from './../../../utils/config';

import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {

  locationName:string;
  description:string;
  picture:string = null;
  uploadPercent:number = null;
  user = null;
  constructor(
    private tostr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private db : AngularFireDatabase
  ) {
    this.auth.getUser().subscribe((user)=>{
      this.db.object(`/Users/${user.uid}`)
      .valueChanges()
      .subscribe((user)=>{
        this.user = user;
        console.log(this.user);
        
      })
    })
   }


  ngOnInit(): void {
  }

  onSubmit(){
    const uid = uuidv4();

    this.db.object(`/posts/${uid}`)
    .set({
      id: uid,
      locationName: this.locationName,
      description: this.description,
      picture: this.picture,
      by: this.user.name,
      instaHandle: this.user.instaUserName,
      Date: Date.now()
    })
    .then(()=>{
      this.tostr.success("Post Added Successfully");
      this.router.navigateByUrl('/');
    })
    .catch((error)=>{
      this.tostr.warning("Upload Failed");
    })
  }

  async uploadFile(event){
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file,imgconfig);
    const filename = uuidv4();
    const fileref = this.storage.ref(filename);

    const task = this.storage.upload(filename, resizedImage);

    task.percentageChanges().subscribe((percentage)=>{
      this.uploadPercent = percentage;
    })

    task.snapshotChanges().pipe(
      finalize(()=>{
        fileref.getDownloadURL().subscribe((url)=>{
          this.picture = url;
        })
      })
    ).subscribe()

  }

}
