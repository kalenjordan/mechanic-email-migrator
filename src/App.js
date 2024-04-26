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


/*
TODO
{% assign order.total_discounts | times: 100 = 0 %} - that's not good.
*/
function App() {

  const [shopifyTemplate, setShopifyTemplate] = useLocalStorage('shopify_template', '');
  const [mechanicTemplate, setMechanicTemplate] = useLocalStorage('mechanic_template', '');
  let [orderPayload, setOrderPayload] = useLocalStorage('order_payload', '');
  let [shopPayload, setShopPayload] = useLocalStorage('shop_payload', '');
  
  let replacements = {
    'subtotal_price': 'order.subtotal_price | times: 100',
    'total_order_discount_amount': 'order.total_discounts | times: 100',
    'shipping_price': 'order.total_shipping_price_set.shop_money.amount',
    'order_name': 'order.name',
    ' subtotal_line_items': ' order.line_items',
    'shipping_amount': 'order.total_shipping_price_set.shop_money.amount',
    'shipping_address': 'order.shipping_address',
    'billing_address': 'order.billing_address',
    'requires_shipping': 'order.requires_shipping', // need to iterate over line items to populate this
    /*
    'shipping_discount': 'TBD',
    'total_duties': 'TBD',
    'tax_price': 'TBD',
    'total_tip': 'TBD',
    'transaction_amount': 'TBD',
    'due_at_date': 'TBD',
    'payment_terms.next_payment.amount_due': 'TBD',
    'consolidated_estimated_delivery_time': 'TBD',
    'po_number': 'TBD',
    'transactions': '',
    'transaction_count': '',
    'order_status_url': '',
    'subtotal_line_items': '',
    'discount_applications': '',
    'payment_terms': '',
    'refund_method_title': '',
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
    order: JSON.parse(orderPayload),
    shop: JSON.parse(shopPayload),
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
