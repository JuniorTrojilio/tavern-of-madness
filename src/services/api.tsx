import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://my-rpg-project.herokuapp.com/api/'
})