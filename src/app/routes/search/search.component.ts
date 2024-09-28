import { HttpHeaders } from '@angular/common/http';
import { Component,inject,signal,effect,Input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Location,CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router'
import { Search } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common/common.service'
import { StoreService } from '../../services/store/store.service'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProfilePipe } from '../../pipes/profile/profile.pipe'
import { ToStringPipe } from '../../pipes/toString/to-string.pipe'
import { Types } from 'mongoose';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Apollo, ApolloModule } from 'apollo-angular';
import { FIND_BY_USERNAME } from '../../graphql/graphql.queries';
import { Model } from '../../../index.d'
import { DocumentNode } from 'graphql';
import { OperationVariables } from 'apollo-client';
import { GraphqlModule } from '../../graphql/graphql.module';
import { GraphqlService } from '../../graphql/graphql.service';
import { ApolloError } from '@apollo/client';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  imports: [
    ProgressSpinnerModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    ProfilePipe,
    ToStringPipe,
    RouterLink,
    RouterOutlet,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    GraphqlModule
  ],

})
export class SearchComponent {
  query = ''
  process = false
  isError = false
  errorMessage = ''
  result = new Array<User>()
  graphqlService = inject(GraphqlService)
  location = inject(Location)
  requestService = inject(RequestService)
  storeService = inject(StoreService)
  commonService = inject(CommonService)
    
  user = this.storeService.user
  authToken = this.storeService.authorization()

  _altId = new Types.ObjectId().toString()


  
  reset(){
    this.process = true
    this.isError = false
    this.errorMessage = ''
  }
 
  onChange(value:string){
    var variables = {u:value}
    var authorization = this.authToken
    var context = {headers:new HttpHeaders({authorization})}
    if(value.length > 0) this.graphqlService.query<Result,Var>(
      {
        query:FIND_BY_USERNAME,
        variables,
        context
      }
    )
    .subscribe(
      r => this.handleSearchResponse(
        r.data,
        r.error
      )
    )
    if(value.length > 0 ){
      this.reset()
    }
  }

  handleSearchResponse(data:Result,error:ApolloError|undefined){
    if(error){

    }
    else{
      this.process = false
      this.result = data._
    }
  }

}

type Var = {u:string}
type Result = {_:User[]}

type User = Pick<Model.User,"_id"> & {
  profile:Omit<Model.Profile,"usersRef"|"_id">,
  message:Model.Message<string,string>,
}
