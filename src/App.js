import './App.css';

import enTranslations from '@shopify/polaris/locales/en.json';
import { 
  AppProvider, Page, Grid, Text, TextField, Card, 
  InlineStack,Button, FooterHelp, Link,
  Toast, Frame, Scrollable, BlockStack
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { useState, useCallback } from 'react';
import { useLocalStorage } from "./useLocalStorage";
import { ClipboardIcon } from '@shopify/polaris-icons';
import { useLiquid, RENDER_STATUS } from 'react-liquid'

function App() {

  const [shopifyTemplate, setShopifyTemplate] = useLocalStorage('shopify_template', '');
  let [orderPayload, setOrderPayload] = useLocalStorage('order_payload', '');
  let [shopPayload, setShopPayload] = useLocalStorage('shop_payload', '');
  let [mechanicTemplate, setMechanicTemplate] = useState();
 
  fetch('/mechanic-email-migrator/pre-email.liquid')
    .then((r) => r.text())
    .then(text  => {
      mechanicTemplate = text + shopifyTemplate;
      setMechanicTemplate(text + shopifyTemplate);
    }) 
  
  const handleShopifyTemplateChange = useCallback(
    (shopifyTemplate) => { 
      setShopifyTemplate(shopifyTemplate);
    },
    [],
  );

  const handleOrderPayloadChange = useCallback(
    (orderPayload) => { 
      setOrderPayload(orderPayload);
    },
    [],
  );

  const handleShopPayloadChange = useCallback(
    (shopPayload) => { 
      setShopPayload(shopPayload);
    },
    [],
  );

  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="Copied Mechanic template to clipboard" onDismiss={toggleActive} />
  ) : null;

  const handleCopyButton = useCallback(() => {
    navigator.clipboard.writeText(mechanicTemplate);
    toggleActive();
  }, []);

  const data = {
    transactions: [],
    order: orderPayload ? JSON.parse(orderPayload) : "",
    shop: shopPayload ? JSON.parse(shopPayload) : "",
  }
  const { status, markup } = useLiquid(mechanicTemplate, data)

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
      <Page title="Shopify To Mechanic Email Template Converter" 
      subtitle="Easily convert your Shopify email notification liquid templates to liquid that can be used in Mechanic tasks"
      >
        <BlockStack gap="500">
          <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
              <Card sectioned>    
                <BlockStack gap="300">
                  <Text as="h2" variant="headingSm">
                    Shopify Template
                  </Text>
                  <Scrollable style={{height: '200px'}}>
                    <TextField
                      value={shopifyTemplate}
                      onChange={handleShopifyTemplateChange}
                      multiline={4}
                      autoComplete="off"
                    />
                  </Scrollable>
                </BlockStack>      
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                <Card sectioned>
                  <BlockStack gap="300">
                    <InlineStack align="space-between">
                      <Text as="h2" variant="headingSm">
                        Generated Mechanic template
                      </Text>
                      <Button icon={ClipboardIcon} onClick={handleCopyButton}>
                        Copy
                      </Button>
                      {toastMarkup}
                    </InlineStack>
                    <Scrollable style={{height: '200px'}}>
                      <TextField
                        disabled
                        value={mechanicTemplate}
                        multiline={4}
                        autoComplete="off"
                      />             
                    </Scrollable>
                  </BlockStack>
                </Card>
            </Grid.Cell>        
          </Grid>
          <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
              <Card sectioned>    
                <BlockStack gap="300">
                  <Text as="h2" variant="headingSm">
                    Order Payload
                  </Text>
                  <Scrollable style={{height: '200px'}}>
                    <TextField
                      value={orderPayload}
                      onChange={handleOrderPayloadChange}
                      multiline={4}
                      autoComplete="off"
                    />
                  </Scrollable>
                </BlockStack>      
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
              <Card>    
                <BlockStack gap="300">
                  <Text as="h2" variant="headingSm">
                    Shop Details
                  </Text>
                  <Scrollable style={{height: '200px'}}>
                    <TextField
                      value={shopPayload}
                      onChange={handleShopPayloadChange}
                      multiline={4}
                      autoComplete="off"
                    />
                  </Scrollable>
                </BlockStack>      
              </Card>
            </Grid.Cell>        
          </Grid>
          <Card>
            <Text as="h2" variant="headingSm">Preview</Text>
            <iframe id="email-preview" srcDoc={markup} width="100%" height="1000"></iframe>
          </Card>
        </BlockStack>
        <FooterHelp>
          This is an {' '}
          <Link monochrome url="https://github.com/kalenjordan/mechanic-email-migrator">
            open source project 
          </Link>
          {' '}          
          sponsored by{' '}
          <Link monochrome url="https://mechanic.dev/">
            Mechanic
          </Link>.

        </FooterHelp>
      </Page>
      </Frame>
    </AppProvider>
  );
}

export default App;
