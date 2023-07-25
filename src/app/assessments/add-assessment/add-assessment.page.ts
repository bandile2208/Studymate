import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.page.html',
  styleUrls: ['./add-assessment.page.scss'],
})
export class AddAssessmentPage implements OnInit {

  minDate: string; 

  toggleValue: string = '';

  constructor(private toast:ToastController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private navCtrl: NavController) { 
      const currentDate = new Date().toISOString().slice(0, 10);
      this.minDate = currentDate;
    }

    modulesCollection: AngularFirestoreCollection<any> | undefined;
    modules: Observable<any[]> | undefined;
    selectedModule: string='';
    type: string= '';
    userId: string = '';
    date: string ='';
    time: string ='';
    duration: number =0;
    building: string ='';
    room: string = '';
    seat: string = '';


    
    
  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.modulesCollection = this.firestore.collection('study').doc(this.userId).collection('modules');
        this.modules = this.modulesCollection.valueChanges();
      } else {
        this.userId = '';
      }
    }); 
  }

  async addAssessment(){
    if(this.validation()){

    let loader = this.loadingController.create({
      message: "please wait",
    });
    (await loader).present();
    try {

      const user = await this.afAuth.currentUser;
      if (user) {
        const userID = user.uid;
        const userDocRef = this.firestore.collection('study').doc(userID).collection('assessments');

        const data = {
           userID: this.userId,
           Module: this.selectedModule,
           Type: this.type,
           Date: this.date,
           Time: this.time,
           Duration: this.duration,
           Building: this.building,
           Room: this.room,
           Seat: this.seat
        };
       
        await userDocRef.add(data);

        (await loader).dismiss();

        this.showToast("Assesment Scheduled Succesfully!");
        await this.navCtrl.navigateBack('/assessments');
      }
    } catch (error) {
      this.showToast("Error adding data");
    }
  }
  }

  showToast ( message : string ){
    this.toast.create ({
    message: message ,
   duration: 2000
   }). then ( toastData => toastData.present ());
  }

  validation()
  {
    if(!this.selectedModule)
    {
      this.showToast("Please Select a Module");
      return false;
  
    }
    if(!this.type)
    {
      this.showToast("Please Select Task Type");
      return false;
  
    }
    if(!this.date)
    {
      this.showToast("Please Enter the Due Date");
      return false;
  
    }
    if(!this.time)
    {
      this.showToast("Please Enter the Title");
      return false;
  
    }
    return true;
  }


}
