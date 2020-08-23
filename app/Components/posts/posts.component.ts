import { Component, OnInit,Input, OnChanges } from '@angular/core';
import {faThumbsDown, faShareSquare, faHeart} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from './../../services/auth.service'
import{AngularFireDatabase} from '@angular/fire/database'

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnChanges {

  @Input() post;
  @Input() user;
  faThumbsUp = faHeart;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;

  uid = null;
  like :number =0;
  disLike: number = 0;
  constructor(
    private auth: AuthService,
    private db : AngularFireDatabase
  ) { 
    this.auth.getUser().subscribe((user)=>{
      this.uid = user?.uid;
    })
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void{
    if(this.post.vote){
      Object.values(this.post.vote).map((val : any)=>{
        if(val.like){
          this.like += 1;
        }
        if(val.disLike){
          this.disLike += 1;
          console.log(`like: ${this.disLike}`);
        }
      })
    }
  }

  likePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`)
    .set({
      like: 1,  
    })

  }

  disLikePost(){
    console.log('dislike invoked');
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`)
    .set({
      disLike: 1,  
    })
  }

  getInstaUrl(){
    return `https://instagram.com/${this.post.instaHandle}`;
  }


}
