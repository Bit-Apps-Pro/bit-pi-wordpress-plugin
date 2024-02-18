import { type Slug } from '@features/FlowBuilder/internals/BuilderLeftSideBar/data/toolListData'
import bitForm from '@resource/img/apps/bit-form.svg'
import elementor from '@resource/img/apps/elementor.svg'
import fluentForms from '@resource/img/apps/fluent-forms.svg'
import googleCalendar from '@resource/img/apps/google-calendar.svg'
import googleDrive from '@resource/img/apps/google-drive.svg'
import googleSheet from '@resource/img/apps/google-sheet.svg'
import jotForm from '@resource/img/apps/jot-form.svg'
import webhook from '@resource/img/apps/webhook.svg'
import zohoCrm from '@resource/img/apps/zoho-crm.svg'

export interface AppType {
  title: string
  iconURL: string
  color: string
  tags: string[]
  type: 'node'
  slug: string // must be unique and camelCase and must contain machine in machines folder
}

const appsListData = [
  {
    title: 'Webhook',
    slug: 'webhook',
    type: 'node',
    color: '#ffeee7',
    iconURL: webhook,
    tags: ['webhook', 'hook']
  },
  {
    title: 'Elementor Form',
    slug: 'elementorForm',
    type: 'node',
    color: '#ffe5f0',
    iconURL: elementor,
    tags: ['elementor form', 'elementor', 'form']
  },
  {
    title: 'Bit Form',
    slug: 'bitForm',
    type: 'node',
    color: '#ffe7eb',
    iconURL: bitForm,
    tags: ['bit form', 'form']
  },
  {
    title: 'Fluent Forms',
    slug: 'fluentForms',
    type: 'node',
    color: '#d1f6ff',
    iconURL: fluentForms,
    tags: ['fluent forms', 'form']
  },
  {
    title: 'Jot Form',
    slug: 'jotForm',
    type: 'node',
    color: '#e3f5ff',
    iconURL: jotForm,
    tags: ['jot form', 'form']
  },
  {
    title: 'Zoho CRM',
    slug: 'zohoCrm',
    type: 'node',
    color: '#e6efff',
    iconURL: zohoCrm,
    tags: ['zoho crm', 'crm', 'zoho']
  },
  {
    title: 'Google Sheet',
    slug: 'googleSheet',
    type: 'node',
    color: '#e3fff2',
    iconURL: googleSheet,
    tags: ['google', 'sheet', 'google sheet']
  },
  {
    title: 'Google Calendar',
    slug: 'googleCalendar',
    type: 'node',
    color: '#e3eeff',
    iconURL: googleCalendar,
    tags: ['google', 'calender', 'google calender']
  },
  {
    title: 'Google Drive',
    slug: 'googleDrive',
    type: 'node',
    color: '#fff9e3',
    iconURL: googleDrive,
    tags: ['google', 'drive', 'google drive']
  }
] satisfies AppType[]

export default appsListData

export type AppsSlugType = Slug<AppType>
