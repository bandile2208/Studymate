import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

    academicTermsCollection: AngularFirestoreCollection<any> | undefined;
    academicTerms: Observable<any[]> | undefined;

    coursesCollection: AngularFirestoreCollection<any> | undefined;
    courses: Observable<any[]> | undefined;

    modulesCollection: AngularFirestoreCollection<any> | undefined;
    modules: Observable<any[]> | undefined;

    assessmentsCollection: AngularFirestoreCollection<any> | undefined;
    assessments: Observable<any[]> | undefined;

    pastAssessmentsCollection: AngularFirestoreCollection<any> | undefined;
    pastAssessments: Observable<any[]> | undefined;

    tasksCollection: AngularFirestoreCollection<any> | undefined;
    tasks: Observable<any[]> | undefined;

    pastTasksCollection: AngularFirestoreCollection<any> | undefined;
    pastTasks: Observable<any[]> | undefined;


  constructor(private firestore: AngularFirestore,
    private afAuth: AngularFireAuth) { }

    userId: string = '';


  ngOnInit() {
    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10); 

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

    //Displaying Academic Terms
    this.academicTermsCollection = this.firestore.collection('study').doc(this.userId).collection('academicTerms');
    this.academicTerms = this.academicTermsCollection.valueChanges();

    //Displaying Courses
    this.coursesCollection= this.firestore.collection('study').doc(this.userId).collection('courses');
    this.courses = this.coursesCollection.valueChanges();

    //Displaying Modules
    this.modulesCollection = this.firestore.collection('study').doc(this.userId).collection('modules');
    this.modules = this.modulesCollection.valueChanges();

    //Assessments
    this.assessmentsCollection = this.firestore.collection('study').doc(this.userId).collection('assessments', ref => ref.where('Date', '>=', formattedToday));
    this.assessments = this.assessmentsCollection.valueChanges();

    //Past Assessments
    this.pastAssessmentsCollection = this.firestore.collection('study').doc(this.userId).collection('assessments', ref => ref.where('Date', '<', formattedToday));
    this.pastAssessments = this.pastAssessmentsCollection.valueChanges();

    //Tasks
    this.tasksCollection = this.firestore.collection('study').doc(this.userId).collection('tasks', ref => ref.where('Date', '>=', formattedToday));
    this.tasks = this.tasksCollection.valueChanges();

    //Past Tasks
    this.pastTasksCollection = this.firestore.collection('study').doc(this.userId).collection('tasks', ref => ref.where('Date', '<', formattedToday));
        this.pastTasks = this.pastTasksCollection.valueChanges();

  } else {
    this.userId = '';
  }
}); 

  }

}
