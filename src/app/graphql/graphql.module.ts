import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule } from 'apollo-angular';
import { GraphqlService } from './graphql.service';



@NgModule({
  providers:[
    GraphqlService
  ],
  imports: [
    CommonModule,
    ApolloModule
  ],
})
export class GraphqlModule { }
