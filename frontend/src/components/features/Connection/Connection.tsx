/* eslint-disable react/jsx-no-useless-fragment */
import { type ChangeEvent, useEffect, useState } from 'react'

import { $flowSetupModal } from '@common/globalStates'
import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import $shareOauthInfo from '@common/globalStates/$shareOauthInfo'
import { replaceValue } from '@common/helpers/flowMachineUtils'
import config from '@config/config'
import {
  type AuthTypes,
  type ConnectionDetailsType,
  type ConnectionPropsType,
  type VerifyConnectionType
} from '@features/Connection/ConnectionType'
import useSaveConnection from '@features/Connection/data/useSaveConnection'
import { connectionOauth2, getAuthToken } from '@features/Connection/helpers/oauthHelper'
import verifyConnection from '@features/Connection/helpers/verifyConnection'
import LucideIcn from '@icons/LucideIcn'
import Input from '@utilities/Input'
import InputCopyable from '@utilities/InputCopyable'
import Select from '@utilities/Select'
import { Button, Popover, Row, Space, Tooltip, Typography } from 'antd'
import { type InputStatus } from 'antd/es/_util/statusUtils'
import { useAtomValue } from 'jotai'

interface ErrorMsgType {
  [key: string]: { status: InputStatus; invalidMessage: string }
}

const popoverConfig = {
  open: false,
  error: false
}

const redirectURI = `${config.API_URL.base}/oauthCallback`

function getConnectionConfig(appName: string, type?: AuthTypes): ConnectionDetailsType {
  if (type === 'token') {
    return {
      type: 'token',
      connectionName: `${appName} connection`,
      token: ''
    }
  }
  if (type === 'oauth2') {
    return {
      type: 'oauth2',
      connectionName: `${appName} connection`,
      accountName: '',
      clientId: '',
      clientSecret: ''
    }
  }
  return {
    type: undefined,
    connectionName: `${appName} connection`
  }
}

export default function Connection({
  label = 'Connection',
  appName,
  appSlug,
  value,
  wrapperClassName,
  loading = false,
  connectionsTypes,
  helpingText,
  onConnectionChange,
  onConnectionAddChange,
  onConnectionSaveClick,
  onRender
}: ConnectionPropsType) {
  const { id: nodeId } = useAtomValue($flowSetupModal)
  const [popover, setPopover] = useState(popoverConfig)
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetailsType>(
    getConnectionConfig(appName)
  )
  const [isLoading, setIsLoading] = useState(loading)
  const shareAuthInfo = useAtomValue($shareOauthInfo)
  const { saveConnection, isSavingConnection } = useSaveConnection()
  const { states } = useAtomValue($flowNodesFamily(nodeId))
  const [errorMsg, setErrorMsg] = useState<ErrorMsgType>()

  useEffect(() => {
    onRender?.()
  }, [])

  const connectionsTypesOptions = connectionsTypes.map(con => ({
    label: con.label,
    value: con.type
  }))

  const connectionOptions = states?.connections?.map(con => ({
    label: con.connection_name,
    value: con.id
  }))

  const popoverOpen = () => {
    setPopover(prev => ({ ...prev, open: true }))
  }

  const popoverClose = () => {
    setPopover(prev => ({ ...prev, open: false }))
  }

  const handlePopoverOpen = () => {
    if (connectionsTypes.length === 1) {
      const newConnDetails = { ...getConnectionConfig(appName, connectionsTypes[0].type) }

      setConnectionDetails(newConnDetails)
      onConnectionAddChange?.(newConnDetails)
    }

    popoverOpen()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value: val } = e.target

    setConnectionDetails(prev => {
      const connection = { ...prev, [name]: val }

      onConnectionAddChange?.(connection)
      return connection
    })
  }

  const handleTypeOnchange = (connectionTypeValue: string) => {
    const selectedConnection = connectionsTypes.find(con => con.type === connectionTypeValue)
    if (!selectedConnection) return

    const newConnDetails = { ...getConnectionConfig(appName, selectedConnection.type) }

    setConnectionDetails(newConnDetails)
    onConnectionAddChange?.(newConnDetails)
  }

  const handleConnection = (connectionValue: number) => {
    onConnectionChange?.(connectionValue)
  }

  const handleSaveConnection = async <T,>(authDetails: T, encryptKeys?: string[]) => {
    const { data } = await saveConnection({
      app_slug: appSlug,
      auth_type: connectionDetails.type,
      connection_name: connectionDetails.connectionName,
      encrypt_keys: encryptKeys,
      auth_details: authDetails
    })

    const defaultValue = getConnectionConfig(appName)
    popoverClose()
    setConnectionDetails(defaultValue)
    // onConnectionAddChange?.(defaultValue)
    handleConnection(data.id)
  }

  const handleSave = async () => {
    setErrorMsg({})

    if (onConnectionSaveClick) {
      onConnectionSaveClick?.(connectionDetails)
      return
    }

    if (connectionDetails.type === 'token') {
      const connection = connectionsTypes.find(item => item.type === 'token')
      if (!connection) return

      setIsLoading(true)
      const isVerified = await verifyConnection(connection.verifyConnection)

      if (isVerified) {
        await handleSaveConnection({ token: connectionDetails.token }, connection.encryptKeys)
      } else {
        setErrorMsg({ token: { status: 'error', invalidMessage: 'Invalid token' } })
      }

      setIsLoading(false)
    } else if (connectionDetails.type === 'oauth2') {
      const connection = connectionsTypes.find(con => con.type === 'oauth2')
      if (!connection) return

      setIsLoading(true)
      connectionOauth2(connection, setIsLoading)
    } else {
      console.error('"onConnectionSaveClick" is not defined')
    }
  }

  const handleGetAuthToken = async () => {
    if (connectionDetails.type !== 'oauth2') return

    const connection = connectionsTypes.find(con => con.type === 'oauth2')
    if (!connection) return

    const authToken = await getAuthToken(connection)
    if (!authToken) {
      setIsLoading(false)
      setErrorMsg({ oauth: { status: 'error', invalidMessage: 'Client id or secret not correct!' } })
      return
    }

    let isVerified = true
    if (connection.verifyConnection) {
      const newCon = replaceValue<VerifyConnectionType>(connection.verifyConnection, authToken)
      isVerified = await verifyConnection(newCon)
    }

    if (isVerified) {
      await handleSaveConnection(
        {
          ...authToken,
          client_id: connectionDetails.clientId,
          client_secret: connectionDetails.clientSecret
        },
        connection.encryptKeys
      )
    } else {
      setErrorMsg({ oauth: { status: 'error', invalidMessage: 'Connection verification failed!' } })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  useEffect(() => {
    if (Object.keys(shareAuthInfo).length > 0) {
      handleGetAuthToken()
    }
  }, [shareAuthInfo])

  return (
    <Select
      wrapperClassName={wrapperClassName}
      onChange={handleConnection}
      value={value}
      label={label}
      placeholder="Choose a connection"
      options={connectionOptions}
      disabled={popover.open || isLoading}
      loading={isLoading}
      suffix={
        <Popover
          placement="right"
          open={popover.open}
          overlayStyle={{ zIndex: 999999 }}
          title={
            <Row justify="space-between">
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {label}
              </Typography.Title>
              <Button onClick={popoverClose} size="small" type="text" icon={<LucideIcn name="x" />} />
            </Row>
          }
          content={
            <Space direction="vertical">
              {connectionsTypes?.length > 1 && (
                <Select
                  label="Connection type"
                  onChange={handleTypeOnchange}
                  placeholder="Choose type"
                  value={connectionDetails.type}
                  options={connectionsTypesOptions}
                  disabled={isLoading || isSavingConnection}
                />
              )}
              <Input
                label="Connection Name"
                name="connectionName"
                onChange={handleChange}
                value={connectionDetails.connectionName}
                disabled={isLoading || isSavingConnection}
              />

              {'token' in connectionDetails && (
                <Input
                  label="Token"
                  name="token"
                  status={errorMsg?.token?.status}
                  invalidMessage={errorMsg?.token?.invalidMessage}
                  onChange={handleChange}
                  value={connectionDetails.token}
                  disabled={isLoading || isSavingConnection}
                />
              )}
              {connectionDetails.type === 'oauth2' && (
                <InputCopyable
                  label="Redirect URI"
                  value={redirectURI}
                  disabled={isLoading || isSavingConnection}
                />
              )}
              {'clientId' in connectionDetails && (
                <Input
                  label="Client Id"
                  name="clientId"
                  status={errorMsg?.oauth?.status}
                  onChange={handleChange}
                  value={connectionDetails.clientId}
                  disabled={isLoading || isSavingConnection}
                />
              )}
              {'clientSecret' in connectionDetails && (
                <Input
                  label="Client Secret"
                  name="clientSecret"
                  status={errorMsg?.oauth?.status}
                  invalidMessage={errorMsg?.oauth?.invalidMessage}
                  onChange={handleChange}
                  value={connectionDetails.clientSecret}
                  disabled={isLoading || isSavingConnection}
                />
              )}

              {helpingText && (
                <Typography.Text type="secondary">
                  <span dangerouslySetInnerHTML={{ __html: helpingText }} />
                </Typography.Text>
              )}

              <Space>
                <Button disabled={isLoading || isSavingConnection} onClick={popoverClose}>
                  Close
                </Button>
                <Button loading={isLoading || isSavingConnection} onClick={handleSave} type="primary">
                  Save
                </Button>
              </Space>
            </Space>
          }
        >
          <>
            <Tooltip title="Add new connection">
              <Button disabled={popover.open} onClick={handlePopoverOpen}>
                Add
              </Button>
            </Tooltip>
          </>
        </Popover>
      }
    />
  )
}
