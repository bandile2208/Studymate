import { Component, OnInit, inject } from '@angular/core';
import {getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';

 
@Component({
  selector: 'app-material',
  templateUrl: './material.page.html',
  styleUrls: ['./material.page.scss'],
})
export class MaterialPage implements OnInit {

  selectedFile: File | null = null;
  userId: string = '';
  selectedFileName: string | null = null;

  constructor(private afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0]; // Save the selected file object
      this.selectedFileName = this.selectedFile.name; // Display the selected file name
    } else {
      this.selectedFile = null;
      this.selectedFileName = null;
    }
  }

  

  async uploadFile(selectedFile: any){

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;

        try{
          const storage = getStorage();
          const contentType = selectedFile.type;
          const storageRef = ref(storage, 'files/'+selectedFile+contentType);
      
          uploadBytesResumable(storageRef, selectedFile);
            console.log('Uploaded a blob or file!');
          }
          catch(error){
            console.error('Error uploading file:', error);
          }

      }
      else {
        this.userId = '';
      }
    });
    /*const file = ref(storage, selectedFile);
    const files = ref(storage, 'files/selectedFile')*/

  }
  
}
