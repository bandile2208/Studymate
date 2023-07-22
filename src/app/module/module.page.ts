import { Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-module',
  templateUrl: './module.page.html',
  styleUrls: ['./module.page.scss'],
})
export class ModulePage implements OnInit {

  daysOfWeek= [
  {name: 'Monday', selected: false, time: null},
  {name: 'Tuesday', selected: false, time: null},
  {name: 'Wednesday', selected: false, time: null},
  {name: 'Thursday', selected: false, time: null},
  {name: 'Friday', selected: false, time: null},
  {name: 'Saturday', selected: false, time: null},
  {name: 'Sunday', selected: false, time: null},
];
 
  userId: string = '';
  name: string='';
  selectedCourse: string='';
  coursesCollection: AngularFirestoreCollection<any> | undefined;
  courses: Observable<any[]> | undefined;
  building: string='';
  room: string='';
  lecturer: string='';
  occurence: string='';
  
  date: string='';
  startTime: string='';
  endTime: string='';




  selectedOption: string='';

  constructor(private loadingController: LoadingController,
    private toast:ToastController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore) { 
    this.selectedOption='once';
  }


  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.coursesCollection = this.firestore.collection('study').doc(this.userId).collection('courses');
        this.courses = this.coursesCollection.valueChanges();
      } else {
        this.userId = '';
      }
    }); 
  }

  async addModule()
  {
    let loader = this.loadingController.create({
      message: "please wait",
    });
    (await loader).present();
    try {
      
      
      const user = await this.afAuth.currentUser;
      if (user) {
        const userID = user.uid;
        const userDocRef = this.firestore.collection('study').doc(userID).collection('modules');

        if(this.selectedOption === 'once')
        {

          const data = {
            userID: this.userId,
            Name: this.name,
            Course: this.selectedCourse,
            Building: this.building,
            Room: this.room,
            Lecturer: this.room,
            Occurs: this.selectedOption,
            Date: this.date,
            StartTime: this.startTime,
            EndTime: this.endTime
         };
        
         await userDocRef.add(data);
 
         (await loader).dismiss();
 
         this.showToast("Data added successfully!");

        }
        else if(this.selectedOption === 'multiple')
        {
          const data = {
            userID: this.userId,
            Name: this.name,
            Course: this.selectedCourse,
            Building: this.building,
            Room: this.room,
            Lecturer: this.room,
            Occurs: this.selectedOption,
            StartTime: this.startTime,
            EndTime: this.endTime,
            Days: this.selectedValues
         };
        
         await userDocRef.add(data);
 
         (await loader).dismiss();
 
         this.showToast("Data added successfully!");

        }

      }

    } catch (error) {
      (await loader).dismiss();
      this.showToast("Error adding data");
    }
  }

  selectedValues: any[] = [];

  updateSelectedValues(day: any){
    const { name, selected, time } = day;

    if (selected){
      const existingDay = this.selectedValues.find((value) => value.name === name);

      if (!existingDay) {
        // Add the day and time to the selectedValues array
        this.selectedValues.push({ name, time });
        this.showToast("Pushed");
        console.log(this.selectedValues);
      } else {
        // Update the time for the existing day
        existingDay.time = time;
        this.showToast("Updated");
      }
    }

    else{
      const index = this.selectedValues.findIndex((value) => value.name === name);
      if(index !== -1){
        this.selectedValues.splice(index, 1);
        this.showToast("Removed");
      }
    }
  }

  //selectedVAlues array can be used for data update

  showToast ( message : string ){
    this.toast.create ({
    message: message ,
   duration: 2000
   }). then ( toastData => toastData.present ());
  }

}
