import { Suspense } from 'react';
import './App.css';
import { DataLoader } from './components/DataComponents';

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading app...</div>}>
      <DataLoader />
    </Suspense>
  );
};

export default App;
