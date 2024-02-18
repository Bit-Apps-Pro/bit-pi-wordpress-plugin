import { useSearchParams } from 'react-router-dom'

export default function HandleAuthorize() {
  const [searchParams] = useSearchParams()
  const key = searchParams.get('state')
  const value = searchParams.get('code')

  localStorage.setItem(String(key), String(value))
  // console.log({ key, value })

  window.close()

  return <div>loading</div>
}
