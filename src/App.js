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
  const [mechanicTemplate, setMechanicTemplate] = useLocalStorage('mechanic_template', '');
  
  let replacements = {
    'subtotal_price': 'order.subtotal_price | times: 100',
    'total_order_discount_amount': 'order.total_order_discount_amount | times: 100',
    'shipping_price': 'order.shipping_price',
    'order_name': 'order.name',
    /*
    'shipping_amount': '',
    'shipping_discount': '',
    'total_duties': '',
    'tax_price': '',
    'total_tip': '',
    'transaction_amount': '',
    'due_at_date': '',
    'payment_terms.next_payment.amount_due': '',
    'consolidated_estimated_delivery_time': '',
    'po_number': '',
    'transactions': '',
    'transaction_count': '',
    'order_status_url': '',
    'subtotal_line_items': '',
    'discount_applications': '',
    'payment_terms': '',
    'refund_method_title': '',
    'requires_shipping': '',
    'shipping_address': '',
    'billing_address': '',
    'company_location': '',
    'delivery_promise_branded_shipping_line': '',
    */
  };

  const handleChange = useCallback(
    (shopifyTemplate) => { 
      setShopifyTemplate(shopifyTemplate);
      let mechanicTemplate = shopifyTemplate;

      for (let key in replacements) {
        let regex = new RegExp(key, "g");
        mechanicTemplate = mechanicTemplate.replace(regex, replacements[key]);
      }

      setMechanicTemplate(mechanicTemplate);
    },
    [],
  );

  const data = {
      transactions: [],
      order: {
        subtotal_price: 10,
        total_order_discount_amount: 0,
      },
      shop: {
        name: 'Kalen Test Store'
      }
  }

  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="Copied Mechanic template to clipboard" onDismiss={toggleActive} />
  ) : null;

  const handleCopyButton = useCallback(() => {
    navigator.clipboard.writeText(mechanicTemplate);
    toggleActive();
  }, []);

  console.log("mechanic template", mechanicTemplate);

  const { status, markup } = useLiquid(mechanicTemplate, data)
  // let markup = 'test';

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
                      onChange={handleChange}
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
          <Card>
          <Text as="h2" variant="headingSm">Preview</Text>
            <iframe id="email-preview" srcDoc={markup} width="100%" height="800"></iframe>
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
