import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedFeature = 'recipe';

  ngOnInit() {
    const config = {
      apiKey: "AIzaSyADjcMkbHijhtK9uSapcu_0pMC7YCz31Vo",
      authDomain: "yummy-book-24f3b.firebaseapp.com",
      databaseURL: "https://yummy-book-24f3b.firebaseio.com",
      projectId: "yummy-book-24f3b",
      storageBucket: "yummy-book-24f3b.appspot.com",
      messagingSenderId: "54874133007"
    };
    firebase.initializeApp(config);
  }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
