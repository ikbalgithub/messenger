import { gql } from '@apollo/client'
import { Search } from '../..'

export const FETCH_DETAIL = gql`
  query fetchDetail($_id:String!){
    _:fetchDetail(_id:$_id){
       _id
      sender
      value
      groupId
      accept
      sendAt
      read
      contentType
      description
    }  
  }
`

export const FETCH_HISTORY = gql`
  fragment profile on Profile{
    profileImage
    firstName
    surname
  }

  fragment sender on Sender{
    _id
    profile {
      ...profile
    }
  }
  
  fragment accept on Accept{
    _id
    profile {
      ...profile
    }
  }

  fragment result on M {
    _id
    value
    groupId
    contentType
    sendAt
    read
    description
    sender{
      ...sender
    }
    accept{
      ...accept
    }
  }
 
  query fetchHistory($_id:String!){
    _:fetchHistory(_id:$_id){
      _id
      result{
        ...result
      }
    }
  }
`

export const FIND_BY_USERNAME = gql`
  fragment profile on Profile{
    profileImage
    firstName
    surname
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
  }

  query findByUsername($u:String!){
    _:findByUsername(u:$u){
      _id
      profile{
        ...profile
      }
      message{
        ...message
      }
    }
  }
`