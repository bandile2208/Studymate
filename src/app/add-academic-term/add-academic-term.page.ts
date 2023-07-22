import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirestoreService } from '../model/firestore.service';

@Component({
  selector: 'app-add-academic-term',
  templateUrl: './add-academic-term.page.html',
  styleUrls: ['./add-academic-term.page.scss'],
})
export class AddAcademicTermPage implements OnInit {
  
  name: string = '';
  startDate: string = '';
  endDate: string = '';
  userId: string = '';
  newTerm: any = {};
  terms: any[]=[];

  constructor( private loadingController: LoadingController,
    private toast:ToastController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.firestoreService.getTermsByUserId(this.userId).subscribe((notes) => {
          this.terms = this.terms;
        });
      } else {
        this.userId = '';
        this.terms = []; // Clear notes if the user is not logged in
      }
    });
  }

 /* async addAcademicTerm(){

   const {name, startDate, endDate} = this.newTerm;

   const term = {
    name: name,
    startDate: startDate,
    endDate: endDate,
    userId:  this.userId
   }

   this.firestoreService.addTerm(term);
   this.newTerm={};
   this.showToast("Academic Term Added");
  }*/



  async addAcademicTerms() {

    let loader = this.loadingController.create({
      message: "please wait",
    });
    (await loader).present();
    try {

      const user = await this.afAuth.currentUser;
      if (user) {
        const userID = user.uid;
        const userDocRef = this.firestore.collection('study').doc(userID).collection('academicTerms');

        const data = {
          userID: this.userId,
           Name: this.name,
          'Start-Date': this.startDate,
          'End-Date': this.endDate,
        };
       
        await userDocRef.add(data);

        (await loader).dismiss();

        this.showToast("Data added successfully!");
      }
    } catch (error) {
      this.showToast("Error adding data");
    }
  }

  showToast ( message : string ){
    this.toast.create ({
    message: message ,
   duration: 2000
   }). then ( toastData => toastData.present ());
  }

}
