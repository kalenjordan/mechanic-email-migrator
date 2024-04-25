import logo from './logo.svg';
import './App.css';

import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, LegacyCard, Button} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  return (
    <AppProvider i18n={enTranslations}>
    <Page title="Shopify To Mechanic Email Template Migrator">
      <LegacyCard sectioned>
        <Button onClick={() => alert('Button clicked!')}>It's ALIIIIIIIVEEEEE</Button>
      </LegacyCard>
    </Page>
  </AppProvider>
  );
}

export default App;
