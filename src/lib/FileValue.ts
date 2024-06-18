import { isFile } from "complex-utils"
import { fileDataType } from "../../type"

export type fileValueType = string | File | fileDataType

export class FileValue {
  name?: string
  value?: fileValueType
  url?: string
  constructor(file?: fileValueType) {
    this.assign(file)
  }
  assign(file?: fileValueType) {
    if (!file || typeof file === 'string') {
      this.value = file as string
      this.name = file as string
      this.url = undefined
    } else if (isFile(file)) {
      this.value = file
      this.name = file.name
      // 考虑生成下载链接
      this.url = undefined
    } else {
      this.value = file.value
      this.name = file.name
      this.url = file.url
    }
  }
  reset() {
    this.value = undefined
    this.name = undefined
    this.url = undefined
  }
}

export class FileMutipleValue {
  value: FileValue[]
  map: Map<FileValue['value'], FileValue>
  constructor(value?: FileValue[]) {
    this.map = new Map()
    if (value) {
      this.value = value
      this.value.forEach(item => {
        this.map.set(item.value, item)
      })
    } else {
      this.value = []
    }
  }
  assign(target: FileMutipleValue) {
    this.value = target.value
    this.map = target.map
  }
  push(value: FileValue) {
    if (!this.map.get(value.value)) {
      this.map.set(value.value, value)
      this.value.push(value)
    }
  }
  delete(key: FileValue['value']) {
    const item = this.map.get(key)
    if (item) {
      const index = this.value.indexOf(item)
      this.value.splice(index, 1)
      this.map.delete(key)
    }
  }
  truncation(size: number) {
    if (this.value.length > size) {
      const deletes = this.value.splice(size, this.value.length - size)
      deletes.forEach(item => {
        this.map.delete(item.value)
      })
    }
  }
  reset() {
    this.value = []
    this.map.clear()
  }
}
