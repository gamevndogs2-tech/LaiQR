import { ACCOUNT, HOLDER, PAYMENT_APPS, deeplinkUrl, qrUrl, validAmount, validDescription } from './qr.mjs';

const $ = id => document.getElementById(id);
const amount = $('amount');
const description = $('description');
const image = $('qr-image');
const dialog = $('qr-dialog');
function renderQR() {
  $('completion-message').hidden = true;
  $('done-button').setAttribute('aria-expanded', 'false');
  $('bank-picker').hidden = true;
  $('pay-now').setAttribute('aria-expanded', 'false');
  document.querySelectorAll('#bank-picker a[data-app]').forEach(link => link.removeAttribute('href'));
  const amountValue = amount.value.trim();
  const descriptionValue = description.value.trim();
  const amountValid = validAmount(amountValue);
  const descriptionValid = validDescription(descriptionValue);
  $('amount-error').textContent = !amountValue || amountValid ? '' : 'Nhập số tiền nguyên dương, chỉ gồm chữ số.';
  $('description-error').textContent = !descriptionValue || descriptionValid ? '' : 'Chỉ nhập chữ không dấu, số và khoảng trắng (tối đa 94 ký tự).';
  amount.setAttribute('aria-invalid', String(Boolean(amountValue) && !amountValid));
  description.setAttribute('aria-invalid', String(Boolean(descriptionValue) && !descriptionValid));
  const valid = amountValid && descriptionValid;
  $('open-qr').disabled = !valid;
  image.hidden = !valid;
  $('qr-placeholder').hidden = valid;
  $('download-qr').classList.toggle('disabled', !valid);
  $('download-qr').setAttribute('aria-disabled', String(!valid));
  $('done-button').disabled = !valid;
  $('pay-now').disabled = !valid || !['http:', 'https:'].includes(location.protocol);
  if (!valid) {
    image.removeAttribute('src');
    const message = !amountValue && !descriptionValue ? 'Vui lòng nhập số tiền và nội dung chuyển khoản'
      : !amountValue ? 'Vui lòng nhập số tiền'
      : !descriptionValue ? 'Vui lòng nhập nội dung chuyển khoản'
      : 'Vui lòng sửa thông tin để tạo mã QR.';
    $('qr-placeholder').textContent = message;
    $('qr-status').textContent = message;
    $('form-status').textContent = message;
    return;
  }
  $('download-qr').href = qrUrl(amountValue, descriptionValue, true);
  $('form-status').textContent = 'Đã sẵn sàng để xem mã QR.';
}

function openDialog() {
  if (dialog.open) return;
  renderQR();
  if ($('open-qr').disabled) return;
  image.src = qrUrl(amount.value.trim(), description.value.trim());
  image.alt = `Mã VietQR chuyển khoản đến VietinBank, số tài khoản ${ACCOUNT}`;
  $('summary-amount').textContent = `${new Intl.NumberFormat('vi-VN').format(Number(amount.value.trim()))} đ`;
  $('summary-description').textContent = description.value.trim();
  $('qr-status').textContent = 'Đang tải mã QR…';
  dialog.showModal();
}

amount.addEventListener('input', renderQR);
description.addEventListener('input', renderQR);
amount.addEventListener('change', () => setTimeout(openDialog, 0));
description.addEventListener('change', () => setTimeout(openDialog, 0));
[amount, description].forEach(field => field.addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); openDialog(); }
}));
$('open-qr').addEventListener('click', openDialog);
$('close-qr').addEventListener('click', () => dialog.close());
document.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => {
  amount.value = button.dataset.amount;
  renderQR();
  if (!$('open-qr').disabled) openDialog();
}));
image.addEventListener('load', () => { $('qr-status').textContent = 'Mã đã sẵn sàng để quét.'; });
image.addEventListener('error', () => { $('qr-status').textContent = 'Không tải được mã QR. Hãy kiểm tra kết nối và thử lại.'; });
$('copy-account').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(ACCOUNT);
    $('copy-account').textContent = 'Đã sao chép';
    setTimeout(() => { $('copy-account').textContent = 'Sao chép'; }, 1800);
  } catch {
    $('copy-account').textContent = 'Không sao chép được';
  }
});
$('download-qr').addEventListener('click', event => {
  if (event.currentTarget.getAttribute('aria-disabled') === 'true') event.preventDefault();
});
$('pay-now').addEventListener('click', () => {
  document.querySelectorAll('#bank-picker a[data-app]').forEach(link => {
    if (Object.hasOwn(PAYMENT_APPS, link.dataset.app)) {
      link.href = deeplinkUrl(link.dataset.app, amount.value.trim(), description.value.trim(), location.origin + location.pathname);
    }
  });
  $('bank-picker').hidden = false;
  $('pay-now').setAttribute('aria-expanded', 'true');
  $('bank-picker a[href]').focus();
});
$('done-button').addEventListener('click', () => {
  $('completion-message').hidden = false;
  $('done-button').setAttribute('aria-expanded', 'true');
});
document.querySelector('[data-theme-toggle]').addEventListener('click', () => {
  const current = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = current === 'dark' ? 'light' : 'dark';
});
$('account-number').textContent = ACCOUNT;
$('account-holder').textContent = HOLDER;
renderQR();
