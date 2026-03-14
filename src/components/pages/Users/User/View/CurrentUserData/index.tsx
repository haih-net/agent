import { MeUserFragment } from 'src/gql/generated'
import { CurrentUserDataRowStyled, CurrentUserDataStyled } from './styles'
import { MetaMaskAuth } from 'src/components/Auth/MetaMaskAuth'
import { TelegramAuthForm } from 'src/components/TelegramAuthForm'
import { Balance } from './Balance'
import { Transactions } from './Transactions'

type CurrentUserData = {
  currentUser: MeUserFragment
}

export const CurrentUserData: React.FC<CurrentUserData> = ({
  currentUser,
  ...other
}) => {
  const { EthAccount, TelegramAccount } = currentUser

  return (
    <CurrentUserDataStyled {...other}>
      {process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME && (
        <CurrentUserDataRowStyled>
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 256 256"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            preserveAspectRatio="xMidYMid"
          >
            <g>
              <path
                d="M128,0 C57.307,0 0,57.307 0,128 L0,128 C0,198.693 57.307,256 128,256 L128,256 C198.693,256 256,198.693 256,128 L256,128 C256,57.307 198.693,0 128,0 L128,0 Z"
                fill="#40B3E0"
              ></path>
              <path
                d="M190.2826,73.6308 L167.4206,188.8978 C167.4206,188.8978 164.2236,196.8918 155.4306,193.0548 L102.6726,152.6068 L83.4886,143.3348 L51.1946,132.4628 C51.1946,132.4628 46.2386,130.7048 45.7586,126.8678 C45.2796,123.0308 51.3546,120.9528 51.3546,120.9528 L179.7306,70.5928 C179.7306,70.5928 190.2826,65.9568 190.2826,73.6308"
                fill="#FFFFFF"
              ></path>
              <path
                d="M98.6178,187.6035 C98.6178,187.6035 97.0778,187.4595 95.1588,181.3835 C93.2408,175.3085 83.4888,143.3345 83.4888,143.3345 L161.0258,94.0945 C161.0258,94.0945 165.5028,91.3765 165.3428,94.0945 C165.3428,94.0945 166.1418,94.5735 163.7438,96.8115 C161.3458,99.0505 102.8328,151.6475 102.8328,151.6475"
                fill="#D2E5F1"
              ></path>
              <path
                d="M122.9015,168.1154 L102.0335,187.1414 C102.0335,187.1414 100.4025,188.3794 98.6175,187.6034 L102.6135,152.2624"
                fill="#B5CFE4"
              ></path>
            </g>
          </svg>
          {TelegramAccount ? (
            <a
              href={`https://t.me/${TelegramAccount.username}`}
              target="_blank"
            >
              {TelegramAccount.username}
            </a>
          ) : (
            <TelegramAuthForm
              buttonSize="small"
              onAuthSuccessHandler={undefined}
            />
          )}
        </CurrentUserDataRowStyled>
      )}

      <CurrentUserDataRowStyled>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="9"
            fill="#627EEA"
            stroke="#627EEA"
            strokeWidth="1"
          />
          <path d="M10 3V10L14.5 12.5L10 3Z" fill="white" />
          <path d="M10 10V17L14.5 12.5L10 10Z" fill="white" opacity="0.6" />
          <path d="M10 10L5.5 12.5L10 3V10Z" fill="white" opacity="0.4" />
          <path d="M10 10L5.5 12.5L10 17V10Z" fill="white" opacity="0.2" />
        </svg>
        {EthAccount ? EthAccount.address : <MetaMaskAuth />}
      </CurrentUserDataRowStyled>

      <Balance currentUser={currentUser} />

      <Transactions />
    </CurrentUserDataStyled>
  )
}
