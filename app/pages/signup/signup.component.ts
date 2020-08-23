import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {ToastrService, ToastRef} from 'ngx-toastr';
import {AuthService} from './../../services/auth.service';

//ng forms
import {NgForm} from '@angular/forms';
import {finalize} from 'rxjs/operators'
//for firebase storage
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFireDatabase} from '@angular/fire/database';

//browser image resizer to compress image
import {readAndCompressImage} from 'browser-image-resizer';
import {imgconfig} from './../../../utils/config'
import {v4 as uuidv4} from 'uuid'

@Component({
  selector: 'app-signup', 
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  uploadPercentage: number = null;
  picture: string =
  "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";

  constructor(
    private tostr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    private db : AngularFireDatabase
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm){
    const {email, password, name, bio, country, username} = f.form.value;

    this.auth.Signup(email, password)
    .then((res)=>{
      const {uid} = res.user;

      this.db.object(`/Users/${uid}`)
      .set({
        id: uid,
        name: name,
        bio: bio,
        country: country,
        instaUserName: username,
        picture: this.picture
      })
    })
    .then(()=>{
      this.router.navigateByUrl('/home');
      this.tostr.success("Singup Successful");
    })
    .catch((err)=>{
      console.log(err);
      this.tostr.warning("SignUp Failed");
    })
  }

  async uploadImage(event){
    const file = event.target.files[0];   //file[0] have localpath of image
    
    let resizedImage = await readAndCompressImage(file, imgconfig);
    
    const filename = uuidv4();
    const fileref = this.storage.ref(filename);

    const task = this.storage.upload(filename,resizedImage);
    task.percentageChanges().subscribe((percentage)=>{
      this.uploadPercentage = percentage;
    })

    task.snapshotChanges()
    .pipe(
      finalize(()=>{
        fileref.getDownloadURL().subscribe((url)=>{
          this.picture = url;
          
          this.tostr.success("Image Uploaded")
        })      
      })
    )
    .subscribe()


  }

}
