import './App.css';

import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider, Page, Grid, Text, TextField, Card, InlineGrid, Button, FooterHelp, Link } 
  from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { useCallback } from 'react';
import { useLocalStorage } from "./useLocalStorage";
import { Icon } from '@shopify/polaris';
import { ClipboardIcon } from '@shopify/polaris-icons';

function App() {

  const [shopifyTemplate, setShopifyTemplate] = useLocalStorage('shopify_template', '');
  const [mechanicTemplate, setMechanicTemplate] = useLocalStorage('mechanic_template', '');
  
  let replacements = {
    'subtotal_price': 'order.subtotal_price | times: 100',
    'total_order_discount_amount': 'order.total_order_discount_amount | times: 100',
    'shipping_price': 'order.shipping_price',
    'shipping_amount': '',
    'shipping_discount': '',
    'total_duties': '',
    'tax_price': '',
    'total_tip': '',
    'transaction_amount': '',
    'due_at_date': '',
    'payment_terms.next_payment.amount_due': '',
    'consolidated_estimated_delivery_time': '',
    'order_name': '',
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

  return (
    <AppProvider i18n={enTranslations}>
      <Page title="Shopify To Mechanic Email Template Converter" 
      subtitle="Easily convert your Shopify email notification liquid templates to liquid that can be used in Mechanic tasks"
      >
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
            <Card sectioned>          
              <Text as="h2" variant="headingSm">
                Shopify Template
              </Text>
              <TextField
                label="Copy in your Shopify email template liquid"
                value={shopifyTemplate}
                onChange={handleChange}
                multiline={4}
                autoComplete="off"
              />
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
            <Card sectioned>   
              <div className="cardHeader">
                <Text as="h2" variant="headingSm">
                  Generated Mechanic template
                </Text>
                <Button icon={ClipboardIcon}>
                  Copy
                </Button>
              </div>
              
              <TextField
                label="Generated Mechanic email template liquid"
                disabled
                value={mechanicTemplate}
                multiline={4}
                autoComplete="off"
              />             
            </Card>
          </Grid.Cell>
          
        </Grid>
        <Card>
          <Button onClick={() => alert('Button clicked!')}>It's ALIIIIIIIVEEEEE</Button>
        </Card>
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
    </AppProvider>
  );
}

export default App;
