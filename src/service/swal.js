import Swal from 'sweetalert2';

export const toast = (icon, title) => {
  Swal.fire({ icon, title, toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, timerProgressBar: true });
};

export const showSuccess = (title) => {
  Swal.fire({ icon: 'success', title, timer: 2000, showConfirmButton: false });
};

export const showError = (msg) => {
  Swal.fire({ icon: 'error', title: 'Erreur', text: msg, confirmButtonColor: '#0A192F' });
};

export const confirmAction = async ({
  title = 'Confirmer la suppression ?',
  text = 'Cette action est irréversible.',
  confirmText = 'Supprimer',
} = {}) => {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#0A192F',
    confirmButtonText: confirmText,
    cancelButtonText: 'Annuler',
  });
  return result.isConfirmed;
};

export default Swal;
