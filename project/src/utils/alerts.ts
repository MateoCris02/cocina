import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

// Configuración de sonidos
const SOUNDS = {
  newOrder: '/sounds/kitchen-bell.mp3',
  orderReady: '/sounds/order-ready.mp3',
  success: '/sounds/success-chime.mp3',
  notification: '/sounds/gentle-notification.mp3'
};

// Función para reproducir sonidos
const playSound = (soundType: keyof typeof SOUNDS) => {
  try {
    const audio = new Audio(SOUNDS[soundType]);
    audio.volume = 0.7;
    audio.play().catch(console.warn);
  } catch (error) {
    console.warn('No se pudo reproducir el sonido:', error);
  }
};

// Alertas para la cocina
export const showKitchenAlert = {
  newOrder: (orderNumber: string, tableNumber: number) => {
    playSound('newOrder');
    return Swal.fire({
      title: '🔔 ¡Nuevo Pedido!',
      html: `
        <div class="text-center">
          <div class="text-3xl font-bold text-orange-600 mb-2">${orderNumber}</div>
          <div class="text-lg text-gray-700">Mesa ${tableNumber}</div>
          <div class="text-sm text-gray-500 mt-2">Revisa los detalles en el panel</div>
        </div>
      `,
      icon: 'info',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#fff3cd',
      customClass: {
        popup: 'animate-bounce'
      }
    });
  },

  orderStarted: (orderNumber: string) => {
    playSound('notification');
    toast.success(`Preparación iniciada - ${orderNumber}`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: 'white',
      },
    });
  },

  orderReady: (orderNumber: string, tableNumber: number) => {
    playSound('orderReady');
    return Swal.fire({
      title: '✅ ¡Pedido Listo!',
      html: `
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 mb-2">${orderNumber}</div>
          <div class="text-lg text-gray-700">Mesa ${tableNumber}</div>
          <div class="text-sm text-gray-500 mt-2">Ticket generado automáticamente</div>
        </div>
      `,
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: 'Ver Ticket',
      confirmButtonColor: '#10b981',
      toast: false,
      position: 'center',
      customClass: {
        popup: 'animate-pulse'
      }
    });
  }
};

// Alertas para el cliente
export const showClientAlert = {
  orderPlaced: (orderNumber: string, estimatedTime: number) => {
    playSound('success');
    return Swal.fire({
      title: '🎉 ¡Pedido Confirmado!',
      html: `
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600 mb-3">${orderNumber}</div>
          <div class="text-lg text-gray-700 mb-2">Tu pedido ha sido enviado a la cocina</div>
          <div class="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Tiempo estimado: ${estimatedTime} minutos</span>
          </div>
        </div>
      `,
      icon: 'success',
      timer: 6000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: 'Ver Estado',
      confirmButtonColor: '#f97316',
      customClass: {
        popup: 'animate-fadeIn'
      }
    });
  },

  orderReady: (orderNumber: string) => {
    playSound('orderReady');
    return Swal.fire({
      title: '🍽️ ¡Tu Pedido Está Listo!',
      html: `
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 mb-3">${orderNumber}</div>
          <div class="text-lg text-gray-700 mb-2">Puedes recoger tu pedido</div>
          <div class="text-sm text-gray-500">Dirígete al mostrador de entrega</div>
        </div>
      `,
      icon: 'success',
      timer: 8000,
      timerProgressBar: true,
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#10b981',
      allowOutsideClick: false,
      customClass: {
        popup: 'animate-bounce'
      }
    });
  },

  sessionExpired: () => {
    return Swal.fire({
      title: '⚠️ Sesión Expirada',
      text: 'Tu sesión ha expirado por inactividad. Por favor, escanea el código QR nuevamente.',
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#f59e0b',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }
};

// Alertas para administración
export const showAdminAlert = {
  itemSaved: (itemName: string) => {
    playSound('success');
    toast.success(`${itemName} guardado correctamente`, {
      duration: 3000,
      position: 'top-right',
    });
  },

  itemDeleted: (itemName: string) => {
    playSound('notification');
    toast.success(`${itemName} eliminado`, {
      duration: 3000,
      position: 'top-right',
    });
  },

  confirmDelete: (itemName: string) => {
    return Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  },

  configSaved: () => {
    playSound('success');
    toast.success('Configuración guardada correctamente', {
      duration: 3000,
      position: 'top-right',
    });
  }
};

// Alertas generales
export const showGeneralAlert = {
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-center',
    });
  },

  success: (message: string) => {
    playSound('success');
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  },

  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
    });
  }
};

// Función para probar sonidos (útil para debugging)
export const testSound = (soundType: keyof typeof SOUNDS) => {
  playSound(soundType);
  toast.success(`Reproduciendo: ${soundType}`, {
    duration: 2000,
    position: 'bottom-right',
  });
};