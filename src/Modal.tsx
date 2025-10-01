import { useEffect, useRef } from 'react';
import type { Item } from './Productos';
import './Modal.css';

interface ModalProps {
  item: Item;
  onClose: () => void;
}

const Modal = ({ item, onClose }: ModalProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // foco inicial: al abrir ponemos foco al container modal
  useEffect(() => {
    const el = ref.current;
    if (el) {
      // focus the modal container so screen readers announce it
      el.focus();
    }
  }, []);

  // Focus trap: manejar Tab / Shift+Tab para que no salga del modal
  // Focus trap + Escape
useEffect(() => {
  const node = ref.current;
  if (!node) return;

  const focusableSelectors =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  const handleKeyDown = (e: KeyboardEvent) => {
    // ESC cierra modal
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    // Tab / Shift+Tab para focus trap
    if (e.key === 'Tab') {
      const focusables = Array.from(
        node.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter(el => el.offsetParent !== null); // visibles

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }
    }
  };

  node.addEventListener('keydown', handleKeyDown);
  return () => node.removeEventListener('keydown', handleKeyDown);
}, [onClose]);



  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => {
        // click outside cierra
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <h2 id="modal-title">{item.title}</h2>
        <div className="modal-body">
  <div className="modal-image-wrapper">
    <img
      src={item.thumbnail}
      alt={item.title}
      width={240}
      height={160}
      loading="lazy"
      style={{ objectFit: 'cover' }}
    />
  </div>
  <p><strong>Categoría:</strong> {item.category}</p>
  <p><strong>Precio:</strong> ${item.price.toFixed(2)}</p>
  <p><strong>Rating:</strong> ⭐ {item.rating}</p>
</div>


        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
