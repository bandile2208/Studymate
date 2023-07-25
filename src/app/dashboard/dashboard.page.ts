import { Component, OnInit } from '@angular/core';
import { MenuService } from '../model/menu.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    tasksCollection: AngularFirestoreCollection<any> | undefined;
    tasks: Observable<any[]> | undefined;

    assessmentsCollection: AngularFirestoreCollection<any> | undefined;
    assessments: Observable<any[]> | undefined;

    modulesCollection: AngularFirestoreCollection<any> | undefined;
    modules: Observable<any[]> | undefined;

    modulesCollection1: AngularFirestoreCollection<any> | undefined;
    modules1: Observable<any[]> | undefined;

    modulesCollection2: AngularFirestoreCollection<any> | undefined;
    modules2: Observable<any[]> | undefined;

    modulesCollection3: AngularFirestoreCollection<any> | undefined;
    modules3: Observable<any[]> | undefined;

    modulesCollection4: AngularFirestoreCollection<any> | undefined;
    modules4: Observable<any[]> | undefined;

    modulesCollection5: AngularFirestoreCollection<any> | undefined;
    modules5: Observable<any[]> | undefined;

    modulesCollection6: AngularFirestoreCollection<any> | undefined;
    modules6: Observable<any[]> | undefined;

    modulesCollection7: AngularFirestoreCollection<any> | undefined;
    modules7: Observable<any[]> | undefined;

    todayTasksCount: number=0;
    todayAssessmentCount: number=0;
    todayTestsCount: number=0;

    monday: string = 'Monday';
    tuesday: string = 'Tuesday';
    wednesday: string = 'Wednesday';
    thursday: string = 'Thursday';
    friday: string = 'Friday';
    saturday: string = 'Saturday';
    sunday: string = 'Sunday';

    tomorrowTasksCount: number=0;
    tomorrowAssessmentCount: number=0;
    tomorrowTestsCount: number=0;
    todayClasses: any[] = [];

    currentClass: any;

    constructor(private menuService: MenuService, 
      private firestore: AngularFirestore,
      private afAuth: AngularFireAuth) {}

      userId: string = '';

     ngOnInit() {

    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10); 

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().slice(0, 10);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDay = daysOfWeek[new Date().getDay()];
  
    
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        //displaying tasks
        this.userId = user.uid;
        this.tasksCollection = this.firestore.collection('study').doc(this.userId).collection('tasks', ref => ref.where('Date', '==', formattedToday));
        this.tasks = this.tasksCollection.valueChanges();
        //numberOf

        //displaying assessments
        this.assessmentsCollection = this.firestore.collection('study').doc(this.userId).collection('assessments', ref => ref.where('Date', '==', formattedToday));
        this.assessments = this.assessmentsCollection.valueChanges();
        //NumberOf
        
        
        //displaying classes if monday
        this.modulesCollection = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Day', '==', todayDay));
        this.modules = this.modulesCollection.valueChanges();

        //displaying classes if tuesday
        this.modulesCollection1 = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Day1', '==', todayDay));
        this.modules1 = this.modulesCollection1.valueChanges();

        //displaying classes if Wednesday
        this.modulesCollection2 = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Day2', '==', todayDay));
        this.modules2 = this.modulesCollection2.valueChanges();

        //displaying classes if Thursday
        this.modulesCollection3 = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Day3', '==', todayDay));
        this.modules3 = this.modulesCollection3.valueChanges();

        //displaying classes if Friday
        this.modulesCollection4 = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Day4', '==', todayDay));
        this.modules4 = this.modulesCollection4.valueChanges();

        //displaying classes if saturday
        this.modulesCollection5 = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Day5', '==', todayDay));
        this.modules5 = this.modulesCollection5.valueChanges();

        //displaying classes if sunday
        this.modulesCollection6 = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Day5', '==', todayDay));
        this.modules6 = this.modulesCollection6.valueChanges();
        
        //displaying classes if date
        this.modulesCollection7 = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Date', '==', formattedToday));
        this.modules7 = this.modulesCollection7.valueChanges();
        //NumberOf
        
        

        //displaying Tomorrow task
        this.firestore.collection('study').doc(this.userId).collection('tasks', ref => ref.where('Date', '==', formattedTomorrow))
        .valueChanges()
        .subscribe((tasks) => {
          this.tomorrowTasksCount = tasks.length;
        });

        //displaying tomorrow test
        this.firestore.collection('study').doc(this.userId).collection('assessments', ref => ref.where('Date', '==', formattedTomorrow))
        .valueChanges()
        .subscribe((tests) => {
          this.tomorrowTestsCount = tests.length;
        });

        //displaying tomorrow classes
        

       
      } else {
        this.userId = '';
      }
    }); 
    }

    selectedClasses = true;
    selectedTasks = false;
    selectedExams = false;



  openMenu() {
    this.menuService.toggleMenu();
  }

  toggleSelection(buttonName: string) {
  this.selectedClasses = buttonName === 'Classes';
  this.selectedTasks = buttonName === 'Tasks';
  this.selectedExams = buttonName === 'Exams';
  }

}
