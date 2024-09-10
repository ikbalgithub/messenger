import { gql } from '@apollo/client'
import { Search } from '../..'

export const FIND_BY_USERNAME = gql`
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

  query findByUsername($u:String!){
    findByUsername(u:$u){
      profile{
        ...profile
      }
      message{
        ...message
      }
    }
  }
`