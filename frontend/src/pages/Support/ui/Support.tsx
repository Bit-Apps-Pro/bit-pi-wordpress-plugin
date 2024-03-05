import config from '@config/config'
import LogoIcn from '@icons/LogoIcn'
import LogoText from '@icons/LogoText'
import LucideIcn from '@icons/LucideIcn'
import { ddd } from '@pro/test2'
import ut from '@resource/utilsCssInJs'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Card, Checkbox, Col, Flex, Row, Skeleton, Space, Spin, Typography, theme } from 'antd'

type Plugin = {
  name: string
  slug: string
  icon: string
  description: string
  doc: string
  url: string
}

interface SupportObject {
  supportEmail: string
  supportLink: string
  bitAppsLogo: string
  pluginsList: Plugin[]
}

const { Meta } = Card

const { Title, Paragraph, Link, Text } = Typography

const SUPPORT_FETCH_URL =
  'h_t_t_p_s_:_/_/w_p-ap_i_._b_i_ta_pp_s_._pro_/p_ub_li_c/p_lu_gi_ns-i_nf_o'.replaceAll('_', '')

export default function Support() {
  const { token } = theme.useToken()
  const { data: supportInfo, isLoading } = useQuery<SupportObject, Error>({
    queryKey: ['support'],
    queryFn: () => fetch(`${SUPPORT_FETCH_URL}`).then(res => res.json() as Promise<SupportObject>)
  })

  if (isLoading || !supportInfo)
    return (
      <Flex align="center" justify="center" css={ut({ w: '100%', h: '100%' })}>
        <Spin size="large" tip="Loading..." />
      </Flex>
    )

  return (
    <div className="p-6">
      <div className="mb-5">
        <Space size="middle">
          <LogoIcn size={56} />
          <LogoText h={25} />
        </Space>
      </div>

      {ddd()}

      <Row>
        <Col md={13} sm={24}>
          <div className="mb-5">
            <Paragraph style={{ color: token.colorTextSecondary }}>
              An automation plugin for WordPress, that allows you to send and receive data from different
              platform, apply condition, calculate value and many more feature by just drag and drop.
            </Paragraph>
          </div>

          <div className="mb-5">
            <Title level={5}>Docs</Title>
            <Paragraph style={{ color: token.colorTextSecondary }}>
              Explore our extensive documentation. From beginners to developers - everyone will get an
              answer{' '}
              <Link
                href={supportInfo.pluginsList.find(item => item.name === config.PRODUCT_NAME)?.doc}
                strong
                underline
              >
                here{' '}
                <LucideIcn name="move-up-right" size={12} style={{ transform: 'translateY(-4px)' }} />
              </Link>
            </Paragraph>
          </div>

          <div className="mb-5">
            <Title level={5}>Support</Title>
            <Paragraph style={{ color: token.colorTextSecondary }}>
              In Bit Apps, we provide all kind product support for any types of customer, it dose not
              matter FREE or PRO user. We actively provide support through Email and Live Chat.
            </Paragraph>

            <Space direction="vertical">
              <Text>
                <Flex gap={10}>
                  <LucideIcn name="mail" size={18} />
                  <Link
                    href={`mailto:${supportInfo.supportEmail}`}
                    strong
                    underline
                    style={{ color: token.colorText }}
                  >
                    {supportInfo.supportEmail}
                  </Link>
                </Flex>
              </Text>

              <Text>
                <Flex gap={10}>
                  <LucideIcn name="message-circle" size={18} />
                  <Link href={supportInfo.supportLink} strong>
                    Chat here{' '}
                    <LucideIcn
                      name="move-up-right"
                      size={12}
                      style={{ transform: 'translateY(-4px)' }}
                    />
                  </Link>
                </Flex>
              </Text>
            </Space>
          </div>

          <div className="mb-5">
            <Title level={5}>Improvement</Title>
            <Checkbox style={{ color: token.colorTextSecondary }}>
              Allow to collect javascript errors to improve application.
            </Checkbox>
          </div>
        </Col>

        <Col md={{ span: 9, offset: 2 }} sm={{ span: 24 }}>
          <div className="mb-5">
            <Title level={5}>More Plugins by Bit Apps</Title>

            {supportInfo.pluginsList
              .filter(item => item.slug !== config.PLUGIN_SLUG)
              .map((plugin, index: number) => (
                <Card
                  key={`${index * 2}`}
                  style={{ marginTop: 16, borderColor: token.colorBorder }}
                  bodyStyle={{ padding: '16px 20px', color: 'red !important' }}
                >
                  <Skeleton loading={isLoading} avatar active>
                    <Meta
                      avatar={
                        <Link
                          target="_blank"
                          href={plugin.url}
                          css={{ '&:focus': { boxShadow: 'none' } }}
                        >
                          <Avatar style={{ height: 70, width: 70 }} shape="square" src={plugin.icon} />
                        </Link>
                      }
                      title={
                        <Link
                          target="_blank"
                          href={plugin.url}
                          style={{ color: token.colorTextSecondary, fontSize: '1rem' }}
                          css={{
                            '&:focus': { boxShadow: 'none' },
                            '&:hover': { textDecoration: 'underline !important' }
                          }}
                        >
                          {plugin.name}{' '}
                          <LucideIcn
                            name="move-up-right"
                            size={12}
                            style={{ transform: 'translateY(-4px)' }}
                          />
                        </Link>
                      }
                      description={
                        <Text style={{ color: token.colorTextSecondary }}>{plugin.description}</Text>
                      }
                    />
                  </Skeleton>
                </Card>
              ))}
          </div>
        </Col>
      </Row>
    </div>
  )
}
