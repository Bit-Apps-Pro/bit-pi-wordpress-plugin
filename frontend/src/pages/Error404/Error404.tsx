import { useNavigate } from 'react-router-dom'

import { Button, Result } from 'antd'

export default function Error404() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button onClick={() => navigate('/', { replace: true })} type="primary">
          Back Home
        </Button>
      }
    />
  )
}
