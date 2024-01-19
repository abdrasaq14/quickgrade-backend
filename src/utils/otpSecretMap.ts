export interface OTPSecretInfo {
  secret: string
  createdAt: Date
  user: {
    password: string
    save: () => Promise<void>
  }
}

export type OTPSecretMap = Record<string, OTPSecretInfo>

const otpSecretMap: OTPSecretMap = {}

export default otpSecretMap
