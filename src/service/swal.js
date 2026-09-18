import Swal from 'sweetalert2';
import { t } from '../i18n/i18n';

export const toast = (icon, title) => {
  Swal.fire({ icon, title, toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, timerProgressBar: true });
};

export const showSuccess = (title) => {
  Swal.fire({ icon: 'success', title, timer: 2000, showConfirmButton: false });
};

export const showError = (msg) => {
  Swal.fire({ icon: 'error', title: t('common.error'), text: msg, confirmButtonColor: '#0A192F' });
};

export const confirmAction = async ({
  title = t('common.confirmDeleteTitle'),
  text = t('common.confirmDeleteText'),
  confirmText = t('common.delete'),
} = {}) => {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#0A192F',
    confirmButtonText: confirmText,
    cancelButtonText: t('common.cancel'),
  });
  return result.isConfirmed;
};

export default Swal;
