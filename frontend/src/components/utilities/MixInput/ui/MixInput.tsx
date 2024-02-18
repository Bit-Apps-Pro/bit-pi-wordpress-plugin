/* eslint-disable import/no-named-default */
import { useEffect, useId, useRef, useState } from 'react'
import { default as MixInputComponent, type MixInputRef, type MixInputValue } from 'react-mix-tag-input'
import 'react-mix-tag-input/dist/index.css'

import FlowVariables from '@features/FlowVariables'
import { mappedToMixInput, mixInputToMapped } from '@utilities/MixInput/helpers/mixInputHelpers'
import { Typography, theme } from 'antd'

export type MixInputType = {
  id?: string
  label?: string
  value?: MappedValueType[]
  wrapperClassName?: string
  required?: boolean
  invalidMessage?: string
  helperText?: string
  onChange?: (value: MappedValueType[]) => void
  onRender?: (e?: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function MixInput({
  id,
  label,
  value,
  wrapperClassName,
  required,
  invalidMessage,
  helperText,
  onChange,
  onRender
}: MixInputType) {
  let compId = useId()
  if (id) compId = id

  const { token } = theme.useToken()

  const inputRef = useRef<MixInputRef>(null)
  const [mixInputValue, setMixInputValue] = useState<MixInputValue[]>()
  const [inFocus, setInFocus] = useState(false)

  const focusMixInput = () => {
    inputRef.current?.inputRef?.focus()
  }

  const addTag = (tag: MixInputValue | MixInputValue[]) => {
    focusMixInput()
    inputRef.current?.insertContent(tag)
  }

  const handleChange = (val: MixInputValue[]) => {
    setMixInputValue(val)
    onChange?.(mixInputToMapped(val))
  }

  useEffect(() => {
    if (!value) return
    setMixInputValue(mappedToMixInput(value))
  }, [value])

  useEffect(() => {
    onRender?.()
  }, [])

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={compId} className="mb-1 d-ib" css={{ color: token.colorText }}>
          {label}
        </label>
      )}

      <FlowVariables inFocus={inFocus} onClickVar={addTag} focusMixInput={focusMixInput}>
        <MixInputComponent
          id={compId}
          ref={inputRef}
          onFocus={() => setInFocus(true)}
          onBlur={() => setInFocus(false)}
          onChange={handleChange}
          showTagDeleteBtn={false}
          value={mixInputValue}
          aria-required={required}
        />
      </FlowVariables>

      {invalidMessage && <Typography.Text type="danger">{invalidMessage}</Typography.Text>}
      {!invalidMessage && helperText && <Typography.Text type="secondary">{helperText}</Typography.Text>}
    </div>
  )
}
