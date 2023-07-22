import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {
 
  userId: string = '';
  name: string='';
  selectedTerm: string='';
  academicTermsCollection: AngularFirestoreCollection<any> | undefined;
  academicTerms: Observable<any[]> | undefined;

  constructor(private loadingController: LoadingController,
    private toast:ToastController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore) { }

  ngOnInit() {

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.academicTermsCollection = this.firestore.collection('study').doc(this.userId).collection('academicTerms');
        this.academicTerms = this.academicTermsCollection.valueChanges();
      } else {
        this.userId = '';
      }
    }); 
  }

  async addCourse()
  {
    let loader = this.loadingController.create({
      message: "please wait",
    });
    (await loader).present();
    try {

      const user = await this.afAuth.currentUser;
      if (user) {
        const userID = user.uid;
        const userDocRef = this.firestore.collection('study').doc(userID).collection('courses');

        const data = {
           userID: this.userId,
           Name: this.name,
           academicTerm: this.selectedTerm
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
