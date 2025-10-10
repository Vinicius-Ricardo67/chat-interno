import { response } from 'express'
import data from '../data.json'


export async function get() { 
return response.json(data)     
}