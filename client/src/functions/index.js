import {
  DEFAULT_AVATAR_URL_GROUP,
  DEFAULT_BG_URL_GROUP,
  DEFAULT_AVATAR_URL_SINGLE,
} from '../common'

export const getDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const config = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    HH: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
  }
  for (const key in config) {
    format = format.replace(key, config[key])
  }
  return format
}

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export const testFromCloudiary = (value) => {
  const reg = /https:\/\/res.cloudinary.com/
  return reg.test(value)
}

export const userAvatarHandler = (value) => {
  const url = testFromCloudiary(value) ? `${value}` : DEFAULT_AVATAR_URL_SINGLE
  return url
}

export const groupAvatarHandler = (value) => {
  const url = testFromCloudiary(value) ? `${value}` : DEFAULT_AVATAR_URL_GROUP
  return url
}

export const groupBgHandler = (value) => {
  const url = testFromCloudiary(value) ? `${value}` : DEFAULT_BG_URL_GROUP
  return url
}
