import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


(async () => {
  try{
    await bootstrapApplication(
      AppComponent,appConfig
    )
  }
  catch(err:any){
    console.error(err)
  }
})()



// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
