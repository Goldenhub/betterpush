export interface ITokenProvider {
  getToken(input: { provider: string; user_id: string }): Promise<string>;
}

export interface IGetToken {
  provider: string;
  accessToken: string;
  refreshToken?: string;
  user_id: string;
  team_id?: string;
  provider_user_id: string;
  scope?: string;
}
