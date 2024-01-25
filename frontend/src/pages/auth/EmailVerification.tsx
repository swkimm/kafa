import NotFound from '@/commons/error/NotFound'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import EmailVerificationForm from './EmailVerificationForm'

interface EmailVerificationProps {}

const EmailVerification: React.FC<EmailVerificationProps> = () => {
  const location = useLocation()
  const [valid, setValid] = useState(false)
  const [account, setAccount] = useState({
    accountId: 0,
    email: ''
  })

  const renderComponent = () => {
    if (valid) {
      return (
        <EmailVerificationForm
          accountId={account.accountId}
          email={account.email}
        />
      )
    } else {
      return <NotFound />
    }
  }

  useEffect(() => {
    const email = new URLSearchParams(location.search).get('email')
    const accountId = new URLSearchParams(location.search).get('accountId')

    setAccount({
      email: email ?? '',
      accountId: parseInt(accountId ?? '0', 10)
    })

    email && accountId ? setValid(true) : setValid(false)
  }, [location.search])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-[320px]">{renderComponent()}</div>
    </div>
  )
}

export default EmailVerification
