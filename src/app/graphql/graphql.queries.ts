import { gql } from 'apollo-angular'
import { Search } from '../..'

export const FIND_BY_USERNAME = gql<Search.Result,{u:string}>`
  fragment profile on Profile{
    _id
    profileImage
    firstName
    surname
    usersRef
  }

  fragment message on Last{
    _id
    sender
    value
    groupId
    accept
    sendAt
    read
    contentType
    description
    unreadCounter
  }
  
  query{
    findByUsername($u:string){
      profile{
        ...profile
      }
      message{
        ...message
      }
    }
  }
`