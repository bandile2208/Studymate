import { Component, OnInit, inject } from '@angular/core';
import {getStorage, ref, uploadBytes, listAll, list } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, ToastController} from '@ionic/angular';
import { Location } from '@angular/common';
import { getDownloadURL } from '@angular/fire/storage';
import { deleteObject } from '@angular/fire/storage';
@Component({
  selector: 'app-material',
  templateUrl: './material.page.html',
  styleUrls: ['./material.page.scss'],
})
export class MaterialPage implements OnInit {


  selectedFile: File | null = null;
  userId: string = '';
  selectedFileName: string | null = null;

  files: any[] = [];


  storage = getStorage();
  storagePath = 'Files/'; 
  constructor(private afAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private  toast:ToastController,
    private location: Location) { }

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.getFiles();
      } else {
        this.userId = '';
      }
    }); 
  }

  async downloadFile(file: any) {

    if (!file || !file.ref) {
      console.error('Invalid file object:', file);
      return;
    }

    try {
      const downloadUrl = await getDownloadURL(file.ref);
      // Create a link element and trigger a download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file.name;
      a.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  async deleteFile(file: any) {
    try {
      await deleteObject(file.ref);
      console.log('File deleted successfully.');
      // After deletion, you may want to refresh the list of files
      this.getFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async getFiles() {
    if (!this.userId) {
      console.error('User ID is not available.');
      return;
    }

    const storageRef = ref(this.storage, `${this.storagePath}${this.userId}/`);

    try {
      const listResult = await listAll(storageRef);
      this.files = listResult.items.map((item)=> ({
        ref: item,
        name: item.name
      }));
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }




  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

 /* async uploadFile(selectedFile: any){

    this.afAuth.authState.subscribe((user) => {

      if (!this.selectedFile) {
        console.error('No file selected.');
        return;
      }

      if (user) {
        this.userId = user.uid;

        try{
          const storage = getStorage();


          let contentType = '';

          const fileExtension = selectedFile.name.split('.').pop();
          if (fileExtension) {
            if (['jpg', 'jpeg', 'png'].includes(fileExtension.toLowerCase())) {
              contentType = 'image/' + fileExtension.toLowerCase();
            }
          }

          const storageRef = ref(storage, 'files/' + selectedFile.name);
      
          uploadBytesResumable(storageRef, selectedFile, { contentType });
            console.log('Uploaded a blob or file!');
          }
          catch(error){
            console.error('Error uploading file:', error);
          }

      }
      else {
        this.userId = '';
      }
    });*/
    /*const file = ref(storage, selectedFile);
    const files = ref(storage, 'files/selectedFile')*/

  //}

 /* async uploadFile() {

    let loader = this.loadingController.create({
      message: "File Uploading Please Wait",
    });

    

    this.afAuth.authState.subscribe(async (user) => {


    if (this.selectedFile) {
      (await loader).present();
      const fileName = this.selectedFile.name;
      const storageRef = ref(this.storage, this.storagePath + fileName);
      uploadBytes(storageRef, this.selectedFile)
        .then(async (snapshot) => {
          this.showToast("File Uploaded!");
          (await loader).dismiss();
        })
        .catch(async (error) => {
          this.showToast("Error Uploading File!");
          console.error( error);
          (await loader).dismiss();
        });
    } else {
      console.warn('No file selected.');
      this.showToast("Please Select a File!");
    }

    
  });

  
  }*/

  async uploadFile() {
    if (!this.selectedFile) {
      console.warn('No file selected.');
      this.showToast("Please Select a File!");
      return;
    }
  
    this.afAuth.authState.subscribe(async (user) => {
      if (!user) {
        console.error('User not logged in.');
        this.showToast('User not logged in.');
        return;
      }
  
    let loader = await this.loadingController.create({
      message: "File Uploading Please Wait",
    });
    await loader.present();
  
    this.userId = user.uid; // Set the userId to the current user's UID
  
    const fileName = this.selectedFile!.name;
    const storageRef = ref(this.storage, `${this.storagePath}${this.userId}/${fileName}`);
  
    try {
      const snapshot = await uploadBytes(storageRef, this.selectedFile!);
      this.showToast("File Uploaded!");
      window.location.reload();
    } catch (error) {
      console.error("Error Uploading File:", error);
      this.showToast("Error Uploading File!");
    } finally {
      await loader.dismiss();
    }
  });
  }
  

  showToast ( message : string ){
    this.toast.create ({
    message: message ,
   duration: 2000
   }). then ( toastData => toastData.present ());
  }
  
}
