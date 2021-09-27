import axios from 'axios'
import { parseCookies } from 'nookies'

export const api = axios.create({
  baseURL: 'https://my-rpg-project.herokuapp.com/api/',
  headers: {
    'Authorization': `Bearer ${parseCookies()['access']}`
  }
})