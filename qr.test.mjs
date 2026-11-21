import test from 'node:test';
import assert from 'node:assert/strict';
import { ACCOUNT, HOLDER, PAYMENT_APPS, deeplinkUrl, qrUrl, validAmount, validDescription } from './qr.mjs';

test('QR tĩnh dùng đúng VietinBank và thông tin nhận tiền', () => {
  assert.equal(ACCOUNT, '105882793068');
  assert.equal(HOLDER, 'MA HOANG LAI');
  const url = new URL(qrUrl('100000', 'THANH TOAN'));
  assert.equal(url.searchParams.get('bank'), 'VietinBank');
  assert.equal(url.searchParams.get('acc'), ACCOUNT);
  assert.equal(url.searchParams.get('holder'), HOLDER);
  assert.equal(url.searchParams.get('amount'), '100000');
  assert.equal(url.searchParams.get('des'), 'THANH TOAN');
  assert.equal(new URL(qrUrl('100000', 'THANH TOAN', true)).searchParams.get('download'), 'true');
});

test('Không tạo QR với số tiền hoặc nội dung sai', () => {
  assert.equal(validAmount(''), false);
  assert.equal(validAmount('0'), false);
  assert.equal(validDescription(''), false);
  assert.equal(validDescription('   '), false);
  assert.equal(validDescription('Chuyển khoản'), false);
  assert.throws(() => qrUrl(''));
  assert.throws(() => qrUrl('100000', ''));
  assert.throws(() => qrUrl('1e6'));
  assert.throws(() => qrUrl('', 'Chuyển khoản'));
});

test('Deeplink mang đúng dữ liệu và chỉ nhận app đã liệt kê', () => {
  assert.deepEqual(Object.keys(PAYMENT_APPS), ['icb', 'bidv', 'ocb', 'acb', 'mb', 'vba']);
  const link = deeplinkUrl('mb', '100000', 'THANH TOAN', 'https://qr.lai.id.vn/');
  assert.match(link, /ba=105882793068@icb/);
  assert.match(link, /url=https:\/\/qr\.lai\.id\.vn\//);
  const params = new URL(link).searchParams;
  assert.equal(params.get('app'), 'mb');
  assert.equal(params.get('am'), '100000');
  assert.equal(params.get('tn'), 'THANH TOAN');
  assert.equal(params.get('bn'), HOLDER);
  assert.equal(new URL(deeplinkUrl('vba', '100000', 'THANH TOAN', 'https://qr.lai.id.vn/')).searchParams.get('app'), 'vba');
  assert.throws(() => deeplinkUrl('vcb', '100000', 'THANH TOAN', 'https://qr.lai.id.vn/'));
  assert.throws(() => deeplinkUrl('mb', '', 'THANH TOAN', 'https://qr.lai.id.vn/'));
  assert.throws(() => deeplinkUrl('mb', '100000', '', 'https://qr.lai.id.vn/'));
  assert.throws(() => deeplinkUrl('mb', '100000', 'THANH TOAN', 'javascript:alert(1)'));
});
