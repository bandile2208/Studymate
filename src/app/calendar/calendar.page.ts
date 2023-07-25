import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  notesCollection: AngularFirestoreCollection<any> | undefined;
  notes: Observable<any[]> | undefined;

  constructor(private toast:ToastController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private modalCtrl: ModalController
    ) { }

    userId: string = '';
    noteTitle: string = '';
    noteContent: string = '';


  ngOnInit() {

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        //displaying notes
        this.userId = user.uid;
        this.notesCollection = this.firestore.collection('study').doc(this.userId).collection('notes');
        this.notes = this.notesCollection.valueChanges();
        
      } else {
        this.userId = '';
      }
    });
    
  }


  async addNote(){
    if(this.validation()){

    let loader = this.loadingController.create({
      message: "please wait",
    });
    (await loader).present();
    try {

      const user = await this.afAuth.currentUser;
      if (user) {
        this.userId = user.uid;
        const userDocRef = this.firestore.collection('study').doc(this.userId).collection('notes');

        const data = {
           userID: this.userId,
           Title: this.noteTitle,
           Content: this.noteContent
        };
        await userDocRef.add(data);

        (await loader).dismiss();

        this.showToast("Note Added Succesfully!");
        await this.navCtrl.navigateBack('/calendar');
      }
    } catch (error) {
      this.showToast("Error adding data");
    }
  }
  }

  validation()
  {
    if(!this.noteTitle)
    {
      this.showToast("Please add a title");
      return false;
  
    }
    if(!this.noteContent)
    {
      this.showToast("Empty Notes are not allowed");
      return false;
  
    }
    
    return true;
  }

  showToast ( message : string ){
    this.toast.create ({
    message: message ,
   duration: 2000
   }). then ( toastData => toastData.present ());
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
