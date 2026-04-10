import { isFile } from "complex-utils"
import type { fileDataType } from "../../type"

export type fileValueType = string | File | fileDataType

export class FileValue {
  value!: fileDataType['value']
  name!: fileDataType['name']
  url?: fileDataType['url']
  constructor(file: fileValueType, isUrl?: boolean) {
    this.assign(file, isUrl)
  }
  assign(file: fileValueType, isUrl?: boolean) {
    if (typeof file === 'string') {
      this.value = file
      this.name = file
      this.url = isUrl ? file : undefined
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
}

export class FileMultipleValue {
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
  assign(target: FileMultipleValue) {
    this.value = target.value
    this.map = target.map
  }
  push(value: FileValue) {
    if (!this.map.get(value.value)) {
      this.map.set(value.value, value)
      this.value.push(value)
    }
  }
  has(key: FileValue['value']) {
    return this.map.has(key)
  }
  delete(key: FileValue['value']) {
    const item = this.map.get(key)
    if (item) {
      const index = this.value.indexOf(item)
      if (index > -1) {
        this.value.splice(index, 1)
      }
      this.map.delete(key)
    }
  }
  truncation(size: number) {
    if (this.value.length > size) {
      const deletes = this.value.splice(size, this.value.length - size)
      deletes.forEach(item => this.map.delete(item.value))
    }
  }
  reset() {
    this.value = []
    this.map.clear()
  }
}
