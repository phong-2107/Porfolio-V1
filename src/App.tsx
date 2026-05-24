import AppProviders from './app/providers/AppProviders';
import AppRoutes from './app/routes/AppRoutes';
import Dependency from './components/utilities/Dependency';
import HeaderV1 from './components/header/HeaderV1';
import SmoothScrollProvider from './components/utilities/SmoothScrollProvider';

export default function App() {
  return (
    <SmoothScrollProvider>
      <Dependency />
      <HeaderV1 />
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </SmoothScrollProvider>
  );
}
