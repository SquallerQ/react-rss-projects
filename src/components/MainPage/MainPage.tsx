import { FC, useEffect, useRef, useState } from 'react';
import Modal from '../Modal/Modal';
import UncontrolledForm from '../UncontrolledForm/UncontrolledForm';
import HookForm from '../HookForm/HookForm';
import { useFormStore } from '../../store';
import './MainPage.css';

const MainPage: FC = () => {
  const [modalType, setModalType] = useState<'uncontrolled' | 'hook' | null>(
    null
  );
  const uncontrolledButtonRef = useRef<HTMLButtonElement>(null);
  const hookButtonRef = useRef<HTMLButtonElement>(null);
  const { forms, markAsRead } = useFormStore();

  const openModal = (type: 'uncontrolled' | 'hook') => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  useEffect(() => {
    uncontrolledButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const newItems = forms.filter((item) => item.isNew);
    newItems.forEach((item) => {
      setTimeout(() => {
        markAsRead(item.id);
      }, 3000);
    });
  }, [forms, markAsRead]);

  return (
    <div className="main-page">
      <h1>React Forms</h1>
      <button
        ref={uncontrolledButtonRef}
        onClick={() => openModal('uncontrolled')}
      >
        Open Uncontrolled Form
      </button>
      <button ref={hookButtonRef} onClick={() => openModal('hook')}>
        Open React Hook Form
      </button>
      <Modal
        isOpen={modalType !== null}
        onClose={closeModal}
        focusRef={
          modalType === 'uncontrolled' ? uncontrolledButtonRef : hookButtonRef
        }
      >
        {modalType === 'uncontrolled' && <UncontrolledForm />}
        {modalType === 'hook' && <HookForm />}
      </Modal>
      <div className="forms-list">
        <h2>Submitted Forms</h2>
        {forms.map((form) => (
          <div
            key={form.id}
            className={`form-tile ${form.isNew ? 'new-tile' : ''}`}
          >
            <p>
              <strong>Name:</strong> {form.name}
            </p>
            <p>
              <strong>Age:</strong> {form.age}
            </p>
            <p>
              <strong>Email:</strong> {form.email}
            </p>
            <p>
              <strong>Gender:</strong> {form.gender}
            </p>
            <p>
              <strong>Country:</strong> {form.country}
            </p>
            <p>
              <strong>Accepted Terms:</strong> {form.acceptTerms ? 'Yes' : 'No'}
            </p>
            <img
              src={form.picture}
              alt="Uploaded picture"
              className="tile-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
