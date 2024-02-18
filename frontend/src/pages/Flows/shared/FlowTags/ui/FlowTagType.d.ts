import { type Dispatch, type SetStateAction } from 'react'

export interface TagType {
  id: number
  title: string
  slug: string
  status: boolean
}

export interface TagsPropsType {
  activeTag: number[]
  setActiveTag: Dispatch<SetStateAction<number[]>>
}
