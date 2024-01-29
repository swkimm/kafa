import { NavLink } from 'react-router-dom'

const navigation = {
  sitemaps: [
    { name: 'HUDDLE', href: '/' },
    { name: '대회정보', href: '/leagues' },
    { name: '팀 정보', href: '/teams' },
    { name: '협회정보', href: '/association' },
    { name: '자료실', href: '/archive' },
    { name: '게시판', href: '/board/public' }
  ],
  partners: [
    { name: '나사라테이핑', href: 'http://nasara.co.kr' },
    { name: '터치다운뉴스', href: 'http://www.tdnews.co.kr' },
    { name: '터치다운샵', href: 'http://www.tdshop.net' }
  ],
  relatives: [
    { name: '대한체육회', href: 'https://www.sports.or.kr/index.do' },
    { name: '문화체육관광부', href: 'https://www.mcst.go.kr/kor/main.jsp' },
    { name: '국민권익위원회', href: 'https://www.acrc.go.kr' },
    { name: '금지약물도핑안내', href: 'https://kada-ad.or.kr' },
    { name: 'IFAF', href: 'https://www.americanfootball.sport' },
    { name: '월간용광로', href: 'https://monthlydragons.tistory.com' }
  ],
  legal: [
    { name: '개인정보처리방침', href: '/term?type=개인정보처리방침' },
    { name: '이용약관', href: '/term?type=이용약관' },
    { name: '이메일무단수집거부', href: '/term?type=이메일무단수집거부' }
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/KAFA.org',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/kafa.org.official',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@afkn9686',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      )
    }
  ]
}

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-screen-xl px-8 pb-8 pt-16 sm:pt-24 lg:px-20 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <img className="h-10" src="/logo/logo.png" alt="KAFA" />
            <div className="text-xs font-light leading-5 text-gray-300">
              <p className="mb-3 text-base font-bold leading-6 text-gray-100">
                사단법인 대한미식축구협회
              </p>
              <p>
                주소: 서울특별시 중구 마른내로 12번길 7-4, 현대프레스타워 906호
              </p>
              <p>Tel 1: 전무이사 홍동혁 010-4801-7008</p>
              <p>Tel 2: 사무처장 박민준 010-9333-9672</p>
              <p>이메일: kafa@kafa.org</p>
            </div>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-100 hover:text-gray-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  사이트맵
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.sitemaps.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  파트너
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.partners.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">
                  관련사이트
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.relatives.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  약관
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-row items-center justify-between border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            © {new Date().getFullYear()} KAFA CO.,LTD
          </p>
          <div className="h-auto w-24 sm:w-32">
            <a
              href="http://aws.amazon.com/what-is-cloud-computing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400"
            >
              <img
                src="https://d0.awsstatic.com/logos/powered-by-aws-white.png"
                alt="Powered by AWS Cloud Computing"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
