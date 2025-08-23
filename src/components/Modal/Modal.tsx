import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  focusRef?: React.RefObject<HTMLButtonElement | null>;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, focusRef }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
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

  const handleOverlayClick = () => {
    if (window.getSelection()?.toString()) {
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="modal-close" ref={closeButtonRef} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
