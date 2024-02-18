import { Typography } from 'antd'

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

export default function Root() {
  return (
    <div className="p-6">
      <Typography.Title level={1}>Welcome to Bit Pi</Typography.Title>
      <Typography.Title level={3}>Automate tasks within your WordPress</Typography.Title>
      <Typography.Title level={5}>More functionality in dashboard coming soon.</Typography.Title>
    </div>
  )
}
