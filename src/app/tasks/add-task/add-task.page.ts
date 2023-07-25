import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.page.html',
  styleUrls: ['./add-task.page.scss'],
})
export class AddTaskPage implements OnInit {

  minDate: string; 

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
  userId: string = '';
  selectedModule: string='';
  date: string='';
  title: string='';
  details: string='';
  type: string='';

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

  async addTask(){
    if(this.validation()){

    let loader = this.loadingController.create({
      message: "please wait",
    });
    (await loader).present();
    try {

      const user = await this.afAuth.currentUser;
      if (user) {
        const userID = user.uid;
        const userDocRef = this.firestore.collection('study').doc(userID).collection('tasks');

        const data = {
           userID: this.userId,
           Module: this.selectedModule,
           Type: this.type,
           Date: this.date,
           Title: this.title,
           Details: this.details
        };
       
        await userDocRef.add(data);

        (await loader).dismiss();

        this.showToast("Task added successfully!");
        await this.navCtrl.navigateBack('/tasks');
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
    if(!this.title)
    {
      this.showToast("Please Enter the Title");
      return false;
  
    }
    return true;
  }

}
