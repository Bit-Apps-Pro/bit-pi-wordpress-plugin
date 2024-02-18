import { type CSSProperties } from 'react'

import type ComponentName from '@common/globalStates/flows/ComponentNameType'
import { type InputPropsType } from '@utilities/Input/Input'
import { type MixInputType } from '@utilities/MixInput/ui/MixInput'
import { type SelectPropsType } from '@utilities/Select/Select'

interface InputWithCompNameType extends InputPropsType {
  componentName: ComponentName
}
interface SelectWithCompNameType extends SelectPropsType {
  componentName: ComponentName
  required?: boolean
  name?: string
}

interface MixInputWithCompNameType extends MixInputType {
  componentName: ComponentName
  name?: string
}

export type FieldPropsType = InputWithCompNameType | SelectWithCompNameType | MixInputWithCompNameType

export type ValueType = {
  label: string
  inputs: FieldPropsType[]
}
export interface InputGroupPropsType {
  label?: string
  className?: string
  style?: CSSProperties
}

export type RepeaterFieldPropsType = {
  label: string
  minGroup?: number
  maxGroup?: number
  fieldsMetaData: FieldPropsType[]
  value?: RepeaterFieldValueType[][]
  addItemButtonLabel?: string
  inputGroupProps?: InputGroupPropsType
  deleteBtnProps?: {
    className?: string
    style?: CSSProperties
  }
  wrapperClassName?: string
  onChange: (values: RepeaterFieldValueType[][]) => void
  onRender?: (e?: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface RepeaterFieldValueType {
  name: string
  value: string | number | boolean | MappedValueType[]
}
