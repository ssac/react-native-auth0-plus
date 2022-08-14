import axios from 'axios';

import { AuthenticatorType, OobChannel } from '../enums/auth0';

interface GeneralResp<Data> {
  data: Data;
}

export interface AssociatePhoneRespData {
  authenticator_type: 'oob';
  oob_code: string;
  binding_method: 'prompt';
  oob_channel: 'sms';
  recovery_codes: string[];
}

export interface AssociateEmailRespData {
  authenticator_type: 'oob';
  binding_method: 'prompt';
  oob_code: string;
  oob_channel: 'email';
  recovery_codes: string[];
}

export interface AssociateAuth0RespData {
  oob_code: string;
  barcode_uri: string;
  authenticator_type: 'oob';
  oob_channel: 'auth0';
  recovery_codes: string[];
}

export interface AssociateOtpRespData {
  secret: string;
  barcode_uri: string;
  authenticator_type: 'otp';
  recovery_codes: string[];
}

export type AssociateRespData =
  | AssociatePhoneRespData
  | AssociateEmailRespData
  | AssociateAuth0RespData
  | AssociateOtpRespData;

export type QueryAuthenticatorResp = {
  active: boolean;
  authenticator_type: AuthenticatorType;
  id: string;
  oob_channel?: OobChannel;
  name?: string; // Masked phone number, "XXXXXXXX7758"
};

export interface ChallengeOtpRespData {
  challenge_type: 'otp';
}

export interface ChallengeOobRespData {
  challenge_type: 'oob';
  binding_method: 'prompt';
  oob_code: string;
}

export type ChallengeRespData = ChallengeOtpRespData | ChallengeOobRespData;

export interface ConfirmOobChallengeRespData {
  access_token: string;
  expires_in: number; // 86400
  id_token: string;
  scope: string; // e.g. "openid profile email"
  token_type: 'Bearer';
}

export default class {
  clientId: string;
  domain: string;

  constructor(clientId: string, domain: string) {
    this.clientId = clientId;
    this.domain = domain;
  }

  async querySmsAuthenticators({ mfa_token }: { mfa_token: string }): Promise<QueryAuthenticatorResp[]> {
    return this.queryAuthenticators({
      mfa_token,
      oob_channel: OobChannel.sms,
      authenticator_type: AuthenticatorType.oob,
    });
  }

  async queryEmailAuthenticators({ mfa_token }: { mfa_token: string }): Promise<QueryAuthenticatorResp[]> {
    return this.queryAuthenticators({
      mfa_token,
      oob_channel: OobChannel.email,
      authenticator_type: AuthenticatorType.oob,
    });
  }

  /**
   * List all authenticators of a client.
   * @param {String} mfa_token: The MFA token responsed from Auth0 from last `mfa_required` error.
   * @param {String} oob_channel: (Optional) Which OOB channel of query authenticators should be filtered.
   * @param {String} authenticator_type: (Optional) Which authenticator type of query authenticators should be filtered.
   * @returns The suitable authenticators
   */
  async queryAuthenticators({
    mfa_token,
    oob_channel,
    authenticator_type,
  }: {
    mfa_token: string;
    oob_channel?: OobChannel;
    authenticator_type?: AuthenticatorType;
  }): Promise<QueryAuthenticatorResp[]> {
    return axios
      .get(`https://${this.domain}/mfa/authenticators`, {
        headers: {
          authorization: `Bearer ${mfa_token}`,
          'content-type': 'application/json',
        },
      })
      .then((resp: GeneralResp<QueryAuthenticatorResp[]>) => {
        const { data } = resp;
        const result: QueryAuthenticatorResp[] = [];

        for (const item of data) {
          if (!item.active) {
            continue;
          }

          if (!!authenticator_type && item.authenticator_type !== authenticator_type) {
            continue;
          }

          if (!!oob_channel && item.oob_channel !== oob_channel) {
            continue;
          }

					result.push(item);
        }

        return result;
      });
  }

  /**
   * Associate user and his phone number.
   * @param {String} mfa_token: The token get from last `mfa_required` error.
   * @param {String} phone_number: The phone number of client used to receive sms code.
   * @returns {String} The OOB Code will be to attached to next confirmation request.
   */
  async associatePhone({
    mfa_token,
    phone_number,
  }: {
    mfa_token: string;
    phone_number: string;
  }): Promise<AssociatePhoneRespData> {
    return this.associate({
      mfa_token,
      phone_number,
      authenticator_types: [AuthenticatorType.oob],
      oob_channels: [OobChannel.sms],
    }) as Promise<AssociatePhoneRespData>;
  }

  async associateEmail({ mfa_token, email }: { mfa_token: string; email: string }): Promise<AssociateEmailRespData> {
    return this.associate({
      mfa_token,
      email,
      authenticator_types: [AuthenticatorType.oob],
      oob_channels: [OobChannel.email],
    }) as Promise<AssociateEmailRespData>;
  }

  /**
   *
   * @param {String} mfa_token: The token get from last `mfa_required` error.
   * @param {String} phone_number: (Optional) The phone number of client used to receive sms code, required only for sms authenticator.
   * @param {Array} oob_channels: List of OOB channel, e.g. sms, voice.
   * @param {Array} authenticator_types: List of authenticator types, e.g. oob, otp.
   * @returns General associate response data of auth0.
   */
  async associate({
    mfa_token,
    phone_number,
    email,
    oob_channels,
    authenticator_types,
  }: {
    mfa_token: string;
    phone_number?: string;
    email?: string;
    oob_channels: OobChannel[];
    authenticator_types: AuthenticatorType[];
  }): Promise<AssociateRespData> {
    const options = {
      method: 'POST',
      url: `https://${this.domain}/mfa/associate`,
      headers: {
        authorization: `Bearer ${mfa_token}`,
        'content-type': 'application/json',
      },
      data: {
        authenticator_types,
        oob_channels,
        ...(phone_number ? { phone_number } : null),
        ...(email ? { email } : null),
      },
    };

    return axios.request(options).then((response: GeneralResp<AssociateRespData>) => {
      return response.data;
    });
  }

  /**
   * Send a challenge with user's phone sms
   * @param {String} authenticator_id: The authenticator id of sms authenticator.
   * @param {String} mfa_token: The MFA token from last `mfa_required` error.
   * @returns {String} OOB Code that needed to pass to next authentication request.
   */
  async challengeOob({
    authenticator_id,
    mfa_token,
  }: {
    authenticator_id: string;
    mfa_token: string;
  }): Promise<string> {
    return this.challenge({
      authenticator_id,
      mfa_token,
      challenge_type: AuthenticatorType.oob,
    }).then((respData) => {
      return (respData as ChallengeOobRespData).oob_code;
    });
  }

  /**
   * General chellenge function to send challenge to auth0 server.
   * @param {String} authenticator_id: The authenticator id of sms authenticator.
   * @param {String} mfa_token: The MFA token from last `mfa_required` error.
   * @param {String} challenge_type: Challenge Type, 'oob' or 'otp'
   * @returns General challenge response data from Auth0 server.
   */
  async challenge({
    authenticator_id,
    mfa_token,
    challenge_type,
  }: {
    authenticator_id: string;
    mfa_token: string;
    challenge_type: AuthenticatorType;
  }): Promise<ChallengeRespData> {
    return axios
      .post(`https://${this.domain}/mfa/challenge`, {
        client_id: this.clientId,
        challenge_type,
        authenticator_id,
        mfa_token,
      })
      .then((resp: GeneralResp<ChallengeRespData>) => resp.data);
  }

  async confirmOobChallenge({
    mfa_token,
    oob_code,
    binding_code,
  }: {
    mfa_token: string;
    oob_code: string;
    binding_code: string;
  }): Promise<ConfirmOobChallengeRespData> {
    return axios
      .post(`https://${this.domain}/oauth/token`, {
        grant_type: 'http://auth0.com/oauth/grant-type/mfa-oob',
        client_id: this.clientId,
        mfa_token,
        oob_code,
        binding_code,
      })
      .then((response: GeneralResp<ConfirmOobChallengeRespData>) => {
        return response.data;
      });
  }
}
