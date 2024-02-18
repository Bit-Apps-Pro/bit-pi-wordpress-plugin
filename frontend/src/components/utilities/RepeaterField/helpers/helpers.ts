import ComponentName from '@common/globalStates/flows/ComponentNameType'
import {
  type FieldPropsType,
  type InputGroupPropsType,
  type InputWithCompNameType,
  type MixInputWithCompNameType,
  type RepeaterFieldValueType,
  type SelectWithCompNameType,
  type ValueType
} from '@utilities/RepeaterField/RepeaterFieldType'
import { create } from 'mutative'

function filterRepeaterField(repeaterFields: ValueType[]) {
  const values = repeaterFields.reduce((storeValue: RepeaterFieldValueType[][], repeaterField) => {
    const filterInputProps = repeaterField.inputs.map((input: FieldPropsType) => {
      const { name, value } = input
      return { name, value } as RepeaterFieldValueType
    })

    storeValue.push(filterInputProps)

    return storeValue
  }, [])

  return values
}

export function createRepeaterValue(
  values: RepeaterFieldValueType[][],
  fieldsMetaData: FieldPropsType[],
  inputGroupProps?: InputGroupPropsType
): ValueType[] {
  return values.map(fields => {
    const inputs = create(fields, draft => {
      draft.forEach((field, index) => {
        const fieldMeta = fieldsMetaData.find((item, i) => index === i && item.name === field.name)

        if (fieldMeta) {
          Object.assign(
            field,
            create(fieldMeta, draft2 => {
              delete draft2.value
            })
          )
        }
      })
    }) as FieldPropsType[]

    return {
      label: inputGroupProps?.label || '',
      inputs
    }
  })
}

export function getUpdatedRepeaterField(
  repeaterFields: ValueType[],
  inputGroupIndex: number,
  inputIndex: number,
  inputValue: string | number | MappedValueType[] | []
) {
  const updatedRepeaterField = create(repeaterFields, draft => {
    const input = draft[inputGroupIndex].inputs[inputIndex]
    input.value = inputValue
    if (input.required) {
      input.invalidMessage = !inputValue ? `${input.label} is required` : ''
    }
  })

  const values = filterRepeaterField(updatedRepeaterField)

  return { values, updatedRepeaterField }
}

export function addRepeaterField(
  repeaterFields: ValueType[],
  fieldsMetaData: FieldPropsType[],
  inputGroupProps: InputGroupPropsType | undefined
) {
  const newRepeaterField = create(repeaterFields, draft => {
    draft.push({
      label: inputGroupProps?.label || '',
      inputs: fieldsMetaData
    })
  })

  const values = filterRepeaterField(newRepeaterField)

  return { values, newRepeaterField }
}

export function deleteRepeaterField(repeaterFields: ValueType[], inputGroupIndex: number) {
  const repeaterFieldAfterDelete = create(repeaterFields, draft => {
    draft.splice(inputGroupIndex, 1)
  })

  const values = filterRepeaterField(repeaterFieldAfterDelete)

  return { values, repeaterFieldAfterDelete }
}

export function isInputField(field: FieldPropsType): field is InputWithCompNameType {
  return field.componentName === ComponentName.input
}

export function isSelectField(field: FieldPropsType): field is SelectWithCompNameType {
  return field.componentName === ComponentName.select
}

export function isMixInputField(field: FieldPropsType): field is MixInputWithCompNameType {
  return field.componentName === ComponentName.mixInput
}
