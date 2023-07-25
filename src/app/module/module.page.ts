import { Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-module',
  templateUrl: './module.page.html',
  styleUrls: ['./module.page.scss'],
})
export class ModulePage implements OnInit {

 
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

  selectedDay: string='';
  selectedTime: string='';

  onCheckboxChange(event: any) {
    this.selectedDay = event.target.checked ? 'Monday' : '';
  }

  selectedDay1: string='';
  selectedTime1: string='';

  onCheckboxChange1(event: any) {
    this.selectedDay1 = event.target.checked ? 'Tuesday' : '';
  }

  selectedDay2: string='';
  selectedTime2: string='';

  onCheckboxChange2(event: any) {
    this.selectedDay2 = event.target.checked ? 'Wednesday' : '';
  }

  selectedDay3: string='';
  selectedTime3: string='';

  onCheckboxChange3(event: any) {
    this.selectedDay3 = event.target.checked ? 'Thursday' : '';
  }

  selectedDay4: string='';
  selectedTime4: string='';

  onCheckboxChange4(event: any) {
    this.selectedDay4 = event.target.checked ? 'Friday' : '';
  }

  selectedDay5: string='';
  selectedTime5: string='';

  onCheckboxChange5(event: any) {
    this.selectedDay5 = event.target.checked ? 'Saturday' : '';
  }

  selectedDay6: string='';
  selectedTime6: string='';

  onCheckboxChange6(event: any) {
    this.selectedDay6 = event.target.checked ? 'Sunday' : '';
  }

  minDate: string; 

  selectedOption: string='';

  constructor(private loadingController: LoadingController,
    private toast:ToastController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private navC: NavController) { 

    this.selectedOption='once';
    const currentDate = new Date().toISOString().slice(0, 10);
      this.minDate = currentDate;
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

if(this.validation()){

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
         this.navC.back();
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
           // Days: this.selectedValues
           
           Day: this.selectedDay,
           Time: this.selectedTime,

           Day1: this.selectedDay1,
           Time1: this.selectedTime1,
           
           Day2: this.selectedDay2,
           Time2: this.selectedTime2,

           Day3: this.selectedDay3,
           Time3: this.selectedTime3,

           Day4: this.selectedDay4,
           Time4: this.selectedTime4,

           Day5: this.selectedDay5,
           Time5: this.selectedTime5,

           Day6: this.selectedDay6,
           Time6: this.selectedTime6,

         };
        
         await userDocRef.add(data);
 
         (await loader).dismiss();
 
         this.showToast("Data added successfully!");
         this.navC.back();
        }

      }

    } catch (error) {
      (await loader).dismiss();
      this.showToast("Error adding data");
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

  validation()
  {
    if(!this.name)
    {
      this.showToast("Please Select a Module");
      return false;
  
    }
    if(!this.selectedCourse)
    {
      this.showToast("Please Select a Course");
      return false;
  
    }
    if(!this.selectedOption)
    {
      this.showToast("Please Select if Class occurs once or Repeats");
      return false;
  
    }
    if(this.selectedOption === 'once' && !this.date){
      
        this.showToast("Please Enter the Date");
        return false;
    }
    if(this.selectedOption === 'once' && !this.startTime){
      
      this.showToast("Please Enter the Starting Time");
      return false;
    }
    return true;
  }

}
