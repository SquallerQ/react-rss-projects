import { Suspense } from 'react';
import './App.css';
import { DataLoader } from './components/DataComponents/DataComponents';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DataLoader />
    </Suspense>
  );
};

export default App;
