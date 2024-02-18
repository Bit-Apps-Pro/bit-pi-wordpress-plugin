import { type MixInputValue } from 'react-mix-tag-input'

export function mixInputToMapped(mixInputValue: MixInputValue[]) {
  const newValue: MappedValueType[] = []
  const functionStack: Array<number> = []

  const insertValue = (value: MappedValueType) => {
    if (functionStack.length > 0) {
      getInsertAbleArgs(newValue, functionStack).push(value)
    } else {
      newValue.push(value)
    }
  }

  mixInputValue.forEach(item => {
    if (typeof item === 'string') {
      insertValue({ type: 'string', value: item })
    } else if (item.type === 'tag') {
      if (item.data.tagType === 'common-variable') {
        insertValue({
          type: 'common-variable',
          label: item.label,
          slug: item.data.slug,
          dType: item.data.dType
        })
      } else if (item.data.tagType === 'variable') {
        insertValue({
          type: 'variable',
          label: item.label,
          nodeId: item.data.nodeId,
          path: item.data.path,
          dType: item.data.dType
        })
      } else if (item.data.tagType === 'function') {
        insertValue({ type: 'function', slug: item.data.slug, args: [] })
        functionStack.push(getInsertAbleArgs(newValue, functionStack).length - 1)
      } else if (item.data.tagType === 'operator') {
        functionStack.pop()
      }
    }
  })

  return newValue
}

function getInsertAbleArgs(newValue: MappedValueType[], functionStack: Array<number>) {
  if (functionStack.length === 0) return newValue

  let argsArray: MappedValueType[] = []
  functionStack.forEach((item, index) => {
    if (index === 0) {
      const funcTag = newValue[item] as FunctionType
      argsArray = funcTag.args
      return
    }
    const funcTag = argsArray[item] as FunctionType
    argsArray = funcTag.args
  })

  return argsArray
}

export function mappedToMixInput(mappedValue: MappedValueType[]) {
  const newValue: MixInputValue[] = []

  mappedValue.forEach(item => {
    if (item.type === 'string') {
      newValue.push(item.value)
    } else if (item.type === 'common-variable') {
      newValue.push({
        type: 'tag',
        label: item.label,
        data: { tagType: 'common-variable', slug: item.slug, dType: item.dType }
      })
    } else if (item.type === 'variable') {
      newValue.push({
        type: 'tag',
        label: item.label,
        data: { tagType: 'variable', nodeId: item.nodeId, path: item.path, dType: item.dType }
      })
    } else if (item.type === 'function') {
      newValue.push({
        type: 'tag',
        label: `${item.slug}(`,
        data: { tagType: 'function', slug: item.slug }
      })
      if (item.args.length > 0) {
        mappedToMixInput(item.args).forEach(arg => {
          newValue.push(arg)
        })
      }
      newValue.push({
        type: 'tag',
        label: ')',
        data: { tagType: 'operator', value: ')' }
      })
    }
  })

  return newValue
}
