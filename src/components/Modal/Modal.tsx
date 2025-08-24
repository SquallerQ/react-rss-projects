import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  focusRef?: React.RefObject<HTMLElement | null>;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, focusRef }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      (focusRef?.current || modalContentRef.current)?.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const elementToFocusOnClose = focusRef?.current;

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      elementToFocusOnClose?.focus();
    };
  }, [isOpen, onClose, focusRef]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (window.getSelection()?.toString()) {
      return;
    }
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" ref={modalContentRef} tabIndex={-1}>
        {children}
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
