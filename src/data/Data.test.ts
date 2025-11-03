import { describe, it, expect } from 'vitest'
import Data from './Data'

describe('Data', () => {
  it('should be instantiable without arguments', () => {
    const dataInstance = new Data()
    expect(dataInstance).toBeInstanceOf(Data)
  })

  it('should have a unique ID', () => {
    const instance1 = new Data()
    const instance2 = new Data()
    // _getId() is a public method to access the internal ID
    expect(instance1._getId()).not.toBe(instance2._getId())
  })

  it('should set and get a parent', () => {
    const parent = new Data()
    const child = new Data()
    
    child.$setParent(parent)
    
    expect(child.$getParent()).toBe(parent)
  })
})
