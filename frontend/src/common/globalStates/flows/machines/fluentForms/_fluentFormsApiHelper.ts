import request from '@common/helpers/request'

type FormType = {
  label: string
  value: string
}

// eslint-disable-next-line import/prefer-default-export
export const getForms = async () => request<FormType[]>('pro_fluent-forms/get-forms')
