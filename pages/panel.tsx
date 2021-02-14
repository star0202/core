import { NextPage, NextPageContext } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { get } from '@utils/Query'
import { parseCookie, redirectTo } from '@utils/Tools'
import { Bot, SubmittedBot, User } from '@types'
import BotCard from '@components/BotCard'
import SubmittedBotCard from '@components/SubmittedBotCard'

const Container = dynamic(() => import('@components/Container'))
const SEO = dynamic(() => import('@components/SEO'))

const Panel:NextPage<PanelProps> = ({ logged, user, submits }) => {
  
	const router = useRouter()
	function toLogin() {
		localStorage.redirectTo = window.location.href
		redirectTo(router, 'login')
	}
	if(!logged) {
		toLogin()
		return <SEO title='관리 패널' />
	}
	return <Container paddingTop>
		<SEO title='관리 패널' />
		<h1 className='text-3xl font-bold'>관리 패널</h1>
		<div className='mt-6'>
			<h2 className='text-2xl font-bold'>나의 봇</h2>
			<div className='grid gap-x-4 2xl:grid-cols-4 md:grid-cols-2 mt-12'>
				{
					(user.bots as Bot[]).map(bot=> <BotCard key={bot.id} bot={bot} manage />)
				}
			</div>
		</div>
		<div className='mt-6'>
			<h2 className='text-2xl font-bold'>봇 심사이력</h2>
			<p className='text-left text-gray-400 text-sm font-medium'>자세히 보려면 카드를 클릭하세요.</p>
			<div className='grid gap-4 2xl:grid-cols-4 md:grid-cols-2 mt-12'>
				{
					submits.map(el=> <SubmittedBotCard key={el.date} href={`/pendingBots/${el.id}/${el.date}`} submit={el} />)
				}
			</div>
		</div>
	</Container>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
	const parsed = parseCookie(ctx)
	const user = await get.Authorization(parsed?.token) || ''
	const submits = await get.botSubmits.load(user)

	return { props: { logged: !!user, user:  await get.user.load(user), submits } }
}

interface PanelProps {
  logged: boolean
  user: User
  submits: SubmittedBot[]
}

export default Panel