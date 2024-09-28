import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { StoreService } from '../services/store/store.service';
import { HttpHeaders } from '@angular/common/http';
import { ApolloQueryResult, OperationVariables } from 'apollo-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  apolloService = inject(Apollo)
  query<R,V extends OperationVariables>(opts:{query:DocumentNode,variables?:V,context?:any}){
    return this.apolloService.watchQuery<R,V>({...opts}).valueChanges
  }
}