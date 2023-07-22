import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { TermData } from './term.mode';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

  export class FirestoreService{

    private termsCollection: AngularFirestoreCollection<any>;
    private terms!: Observable<any[]>;

    constructor( private firestore: AngularFirestore) {
        this.termsCollection = this.firestore.collection('terms');
        this.terms = this.termsCollection.valueChanges();
    }

    getTerms(id: string): Observable<any[]> {
        return this.terms;
      }

    getTermsByUserId(userId: string): Observable<any[]>{
        return this.firestore
      .collection('terms', (ref) => ref.where('userId', '==', userId))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as TermData;
            const id = a.payload.doc.id;
            return { id, ...data };
        })
        )
      );
    }

    addTerm(term: any): Promise<any>{
        return this.termsCollection.add(term);
    }

  }