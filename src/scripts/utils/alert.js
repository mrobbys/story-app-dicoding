import Swal from 'sweetalert2';

// notif untuk toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const alert = {
  // notif success modal
  success: (title, text = '') => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#3b82f6',
    });
  },

  // notif error modal
  error: (title, text = '') => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#ef4444',
    });
  },

  // notif confirm modal
  confirm: (title, text = '') => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    });
  },

  // notif toast untuk success
  toastSuccess: (title) => {
    return Toast.fire({
      icon: 'success',
      title,
    });
  },

  // notif toast untuk error
  toastError: (title) => {
    return Toast.fire({
      icon: 'error',
      title,
    });
  },

  // notif toast untuk info
  toastInfo: (title) => {
    return Toast.fire({
      icon: 'info',
      title,
    });
  },
};
