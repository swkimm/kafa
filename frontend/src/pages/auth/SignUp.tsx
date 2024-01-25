import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AccountInfo from './AccountInfo'
import Term from './Term'

const SignUp = () => {
  const location = useLocation()
  const [aggrement, setAgreement] = useState(false)

  const renderComponent = () => {
    if (aggrement) {
      return <AccountInfo />
    } else {
      return <Term />
    }
  }

  useEffect(() => {
    const use = new URLSearchParams(location.search).get('termUse')
    const personalInfo = new URLSearchParams(location.search).get(
      'termPersonalInfo'
    )

    use === 'Y' && personalInfo === 'Y'
      ? setAgreement(true)
      : setAgreement(false)
  }, [location.search])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white py-20">
      <div className="mx-auto w-full max-w-[320px]">{renderComponent()}</div>
    </div>
  )
}

export default SignUp
