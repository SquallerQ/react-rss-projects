import { FC, useState } from 'react';
import Modal from '../Modal/Modal';
import UncontrolledForm from '../UncontrolledForm/UncontrolledForm';
import HookForm from '../HookForm/HookForm';
import './MainPage.css';

const MainPage: FC = () => {
  const [modalType, setModalType] = useState<'uncontrolled' | 'hook' | null>(
    null
  );

  const openModal = (type: 'uncontrolled' | 'hook') => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div className="main-page">
      <h1>React Forms</h1>
      <button onClick={() => openModal('uncontrolled')}>
        Open Uncontrolled Form
      </button>
      <button onClick={() => openModal('hook')}>Open React Hook Form</button>
      <Modal isOpen={modalType !== null} onClose={closeModal}>
        {modalType === 'uncontrolled' && <UncontrolledForm />}
        {modalType === 'hook' && <HookForm />}
      </Modal>
    </div>
  );
};

export default MainPage;
