import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.page.html',
  styleUrls: ['./assessments.page.scss'],
})
export class AssessmentsPage implements OnInit {

  minDate: string; 
  userId: string = '';
  assignmentID: string = '';
  assessmentsCollection: AngularFirestoreCollection<any> | undefined;
  assessments: Observable<any[]> | undefined;

  pastAssessmentsCollection: AngularFirestoreCollection<any> | undefined;
  pastAssessments: Observable<any[]> | undefined;

  currentDate: Date = new Date();
  upcomingAssessments: any[] = [];
  passedAssessments: any[] = [];

  selectedAssessment: any;

  isChecked: boolean = false;

  openModal() {
    if (this.isChecked) {
      this.setOpen(true);
    }
  }
  

  constructor(private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private toast:ToastController,
    private modalCtrl: ModalController) { 
      const currentDate = new Date().toISOString().slice(0, 10);
      this.minDate = currentDate;
    }

  ngOnInit() { 

    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10); 

    /*this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.assessmentsCollection = this.firestore.collection('study').doc(this.userId).collection('assessments', ref => ref.where('Date', '>=', formattedToday));
        this.assessments = this.assessmentsCollection.valueChanges();
        map((assessments: any[]) => assessments || [])

        this.pastAssessmentsCollection = this.firestore.collection('study').doc(this.userId).collection('assessments', ref => ref.where('Date', '<', formattedToday));
        this.pastAssessments = this.pastAssessmentsCollection.valueChanges();
        
      } else {
        this.userId = '';
      }
    }); */

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.assessmentsCollection = this.firestore.collection('study').doc(this.userId).collection('assessments', ref => ref.where('Date', '>=', formattedToday));
        this.assessments = this.assessmentsCollection.snapshotChanges().pipe(
          map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data();
              const id = action.payload.doc.id;
              return { id, ...data };
            });
          })
        );

        this.pastAssessmentsCollection = this.firestore.collection('study').doc(this.userId).collection('assessments', ref => ref.where('Date', '<', formattedToday));
        this.pastAssessments = this.pastAssessmentsCollection.snapshotChanges().pipe(
          map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data();
              const id = action.payload.doc.id;
              return { id, ...data };
            });
          })
        );

      } else {
        this.userId = '';
      }
    }); 

  }

  selectedUpcoming = true;
  selectedPast = false;

  toggleSelection(buttonName: string) {
  this.selectedUpcoming = buttonName === 'Upcoming';
  this.selectedPast = buttonName === 'Past';
  }

  /*async deleteAssessment(assessmentId: string) {
    try {
      await this.firestore.collection('study').doc(this.userId)
        .collection('assessments').doc(assessmentId).delete();
      console.log('Assessment deleted successfully.');
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  }*/

  async deleteAssessment(assessmentId: string) {

    let loader = this.loadingController.create({
      message: "please wait",
    });

    (await loader).present();

    try {
      await this.firestore.collection('study').doc(this.userId).collection('assessments').doc(assessmentId).delete();
      this.showToast("Assesment Deleted Succesfully!");
    } catch (error) {
      this.showToast("An Error Has Occured!");
    }
    (await loader).dismiss();
  }

  async updateAssessment(assessment: any) {

    let loader = this.loadingController.create({
      message: "please wait",
    });

    (await loader).present();

    this.selectedAssessment = {...assessment}

    try {
      const { id, ...updatedData } = assessment;
      await this.firestore.collection('study').doc(this.userId).collection('assessments').doc(id).update(updatedData);
      this.showToast("Assesment Updated Succesfully!");
      console.log(assessment);
      this.setOpen(false);
      this.isModalOpen = false;
    } catch (error) {
      this.showToast("Error updating assessment:");
      console.log(error)
    }
    (await loader).dismiss();
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
