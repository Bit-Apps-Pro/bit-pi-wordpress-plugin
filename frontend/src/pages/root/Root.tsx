// const defaultValue: RepeaterFieldValueType[][] = [
//   [
//     {
//       name: 'class',
//       value: 'B'
//     },
//     {
//       name: 'full-name',
//       value: 'Test'
//     },
//     {
//       name: 'max-input',
//       value: [
//         {
//           type: 'string',
//           value: 'Test'
//         }
//       ]
//     }
//   ]
// ]
// const fieldsMetaData: FieldPropsType[] = [
//   {
//     componentName: ComponentName.select,
//     label: 'Class',
//     name: 'class',
//     value: '',
//     options: [
//       { label: 'A', value: 'A' },
//       { label: 'B', value: 'B' },
//       { label: 'C', value: 'C', disabled: true }
//     ],
//     required: true,
//     style: { width: 100 }
//   },
//   {
//     componentName: ComponentName.input,
//     label: 'Name',
//     name: 'full-name',
//     value: '',
//     required: true,
//     wrapperClassName: 'w-100'
//   },
//   {
//     componentName: ComponentName.mixInput,
//     label: 'Mix Input',
//     name: 'max-input',
//     value: '',
//     wrapperClassName: 'w-100'
//   }
// ]
import { aaa } from '@pro/test'
import { Typography } from 'antd'

// const p = 'C:/laragon/www/wpdev/wp-content/plugins/bit-flow/pro/frontend/src/'

// const { aaa } = await import(`${p}test`)

export default function Root() {
  // console.log({ aaa: aaa(), imp: import.meta, PRO })
  const pro = aaa()
  // const pro = 'aaa()'

  return (
    <div className="p-6">
      <Typography.Title level={1}>Welcome to Bit Pi {pro}</Typography.Title>
      <Typography.Title level={3}>Automate tasks within your WordPress</Typography.Title>
      <Typography.Title level={5}>More functionality in dashboard coming soon.</Typography.Title>
    </div>
  )
}
