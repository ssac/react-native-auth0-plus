# React Native Auth0 Plus

Added missing functions of [`react-native-auth0`](https://www.npmjs.com/package/react-native-auth0) for full native authentication flow.

For example, there is no API of `react-native-auth0` to handle `mfa_required` error during MFA Login. This library provides APIs to:
1. Query user's existing authenticators (e.g. sms, one-time-password, etc...).
1. If authenticators exist, challenge users with their registered authenticators (e.g. send sms code to user's phone).
1. Otherwise, associate specific authenticator (e.g. sms, email, etc...) with users.


This is an **unofficial** library, all its features should be considered as **alternatives**. Developers should always check if latest official library (react-native-auth0) has implemented the same features before using this library.

## Usages
```typescript
import {
    default as Auth0Plus,
    AuthenticatorType,
    OobChannel
} from 'react-native-auth0-plus';

const helper = new Auth0Plus('<client-id>', '<domain>');
```

For brevity, the rest of the examples will leave out the import and/or instantiation step.

### Query user's existing authenticators
#### Query sms authenticators ONLY
```typescript
const [{ id: smsAuthenticatorId }] = await helper.queryAuthenticators({
    mfa_token,
    oob_channel: OobChannel.sms,
    authenticator_type: AuthenticatorType.oob
});
```

#### Query all authenticators
```typescript
const allAuthenticators = await helper.queryAuthenticators({
    mfa_token
});
```

### Associate users with their phone number or email
After querying user's authenticators and find that user has not associated with specific authenticators. Your app prompts users to input phone numbers or email addresses, sends request to associate with these peronal information and get response of `OOB Code`.

```typescript
// sms
const { oob_code, recovery_codes, ...} = await helper.associatePhone({ mfa_token, phone_number });

// email
const { oob_code, recovery_codes, ...} = await helper.associateEmail({ mfa_token, email });

// General request
const { oob_code, recovery_codes, ...} = await helper.associate({ ... })
```

### Challenge users
After querying user's authenticators and find that user has associated with some authenticators (got authenticator id), Your app challenge these authenticators by using `react-native-auth0`.multifactorChallenge(...) or shortcut of this library.

```typescript
const oobCode = await helper.challengeOob({
    authenticator_id,
    mfa_token,
})
```

The `oobCode` is required for next login flow.


