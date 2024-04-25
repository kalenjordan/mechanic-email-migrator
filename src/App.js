import logo from './logo.svg';
import './App.css';

import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, LegacyCard, Button} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  return (
    <AppProvider i18n={enTranslations}>
    <Page title="Example app">
      <LegacyCard sectioned>
        <Button onClick={() => alert('Button clicked!')}>It's ALIIIIIIIVEEEEE</Button>
      </LegacyCard>
    </Page>
  </AppProvider>
  );
}

export default App;
