import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


(async () => {
  try{
    await bootstrapApplication(
      AppComponent,appConfig
    )
  }
  catch(error:any){
    console.error(error)
  }
})()