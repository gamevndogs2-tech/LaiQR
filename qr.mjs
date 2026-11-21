export const ACCOUNT = '105882793068';
export const HOLDER = 'MA HOANG LAI';
export const PAYMENT_APPS = {
  icb: 'VietinBank iPay',
  bidv: 'BIDV SmartBanking',
  ocb: 'OCB OMNI',
  acb: 'ACB ONE',
  mb: 'MB Bank',
  vba: 'Agribank Plus',
};

export function validAmount(value) {
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value));
}

export function validDescription(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 94 && /^[A-Za-z0-9 ]+$/.test(value);
}

export function qrUrl(amount = '', description = '', download = false) {
  if (!validAmount(amount) || !validDescription(description)) {
    throw new Error('Thông tin QR không hợp lệ.');
  }
  const url = new URL('https://vietqr.app/img');
  url.searchParams.set('acc', ACCOUNT);
  url.searchParams.set('bank', 'VietinBank');
  url.searchParams.set('amount', amount);
  url.searchParams.set('des', description.trim());
  url.searchParams.set('template', 'compact');
  url.searchParams.set('showinfo', 'true');
  url.searchParams.set('fullacc', 'true');
  url.searchParams.set('holder', HOLDER);
  if (download) url.searchParams.set('download', 'true');
  return url.toString();
}

export function deeplinkUrl(appId, amount, description, returnUrl) {
  if (!Object.hasOwn(PAYMENT_APPS, appId) || !validAmount(amount) || !validDescription(description)) {
    throw new Error('Thông tin chuyển khoản không hợp lệ.');
  }
  const callback = new URL(returnUrl);
  if (!['https:', 'http:'].includes(callback.protocol) || callback.search || callback.hash) {
    throw new Error('Đường dẫn quay lại không hợp lệ.');
  }
  const params = new URLSearchParams({ app: appId, am: amount, tn: description.trim(), bn: HOLDER });
  return `https://dl.vietqr.io/pay?${params}&ba=${ACCOUNT}@icb&url=${callback.href}`;
}
