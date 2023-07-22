import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  userId: string = '';
  tasksCollection: AngularFirestoreCollection<any> | undefined;
  tasks: Observable<any[]> | undefined;

  pastTasksCollection: AngularFirestoreCollection<any> | undefined;
  pastTasks: Observable<any[]> | undefined;

  constructor( private afAuth: AngularFireAuth,
    private firestore: AngularFirestore) { 
     
    }

  ngOnInit() {

    const today = new Date();
    const formattedToday = today.toISOString().slice(0, 10); 

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.tasksCollection = this.firestore.collection('study').doc(this.userId).collection('tasks', ref => ref.where('Date', '>=', formattedToday));
        this.tasks = this.tasksCollection.valueChanges();
        map((tasks: any[]) => tasks || [])

        this.pastTasksCollection = this.firestore.collection('study').doc(this.userId).collection('tasks', ref => ref.where('Date', '<', formattedToday));
        this.pastTasks = this.pastTasksCollection.valueChanges();
      } else {
        this.userId = '';
      }
    }); 
  }

  selectedCurrent = true;
  selectedPast = false;

  toggleSelection(buttonName: string) {
  this.selectedCurrent = buttonName === 'Current';
  this.selectedPast = buttonName === 'Past';
  }

}
