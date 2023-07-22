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


    todayTasksCount: number=0;
    todayAssessmentCount: number=0;
    todayTestsCount: number=0;

    tomorrowTasksCount: number=0;
    tomorrowAssessmentCount: number=0;
    tomorrowTestsCount: number=0;
    todayClasses: any[] = [];

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
    const todayTime= null;
    
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
        
        
        //displaying classes
        this.modulesCollection = this.firestore.collection('study').doc(this.userId).collection('modules', ref => ref.where('Days', 'array-contains',{name: todayDay}));
        this.modules = this.modulesCollection.valueChanges();
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
