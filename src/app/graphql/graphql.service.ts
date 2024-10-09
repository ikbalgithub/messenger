import { HttpLink } from 'apollo-angular/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { InMemoryCache, ApolloClient, ApolloClientOptions, ApolloLink } from '@apollo/client';
import { OperationVariables } from 'apollo-client';
import { FETCH_HISTORY } from './graphql.queries';
import { makeVar } from '@apollo/client'

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  apolloService = inject(Apollo)
  client = this.apolloService.client
  query<R,V extends OperationVariables>(opts:Options<V>){
    var result =  this.apolloService.watchQuery<R,V>(
      {
        ...opts,
        fetchPolicy:'cache-first'
      }
    )

    return result.valueChanges
  }

  afterFetch(_id:string){
    const h = this.client.readQuery(
      {
        query:FETCH_HISTORY,
        variables:{
          __typename:"M"
        }
      }
    )

    console.log(h)
  }
}

type Options<V> = {
  query:DocumentNode,
  variables:V,
  context?:any
}