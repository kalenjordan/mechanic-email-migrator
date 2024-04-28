import "./App.css";

import enTranslations from "@shopify/polaris/locales/en.json";
import {
  AppProvider,
  Page,
  Grid,
  Text,
  TextField,
  Card,
  InlineStack,
  Button,
  FooterHelp,
  Link,
  Frame,
  Scrollable,
  BlockStack,
} from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { useState, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { ClipboardIcon } from "@shopify/polaris-icons";
import { useLiquid, RENDER_STATUS } from "react-liquid";
import packageJson from "../package.json";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [shopifyTemplate, setShopifyTemplate] = useLocalStorage(
    "shopify_template",
    ""
  );

  let defaultShopPayload = {
    name: "My Store",
    email_accent_color: "#1990c6",
  };

  let [orderPayload, setOrderPayload] = useLocalStorage("order_payload", "");
  let [shopPayload, setShopPayload] = useLocalStorage(
    "shop_payload",
    JSON.stringify(defaultShopPayload, null, 4)
  );
  let [mechanicTemplate, setMechanicTemplate] = useState();

  let homepageUrl = packageJson.homepage;
  fetch("/mechanic-email-migrator/pre-email.liquid")
    .then((r) => r.text())
    .then((text) => {
      mechanicTemplate = text + shopifyTemplate;
      setMechanicTemplate(mechanicTemplate);
    });

  const handleShopifyTemplateChange = useCallback((shopifyTemplate) => {
    setShopifyTemplate(shopifyTemplate);
  }, []);

  const handleOrderPayloadChange = useCallback((orderPayload) => {
    setOrderPayload(orderPayload);
  }, []);

  const handleShopPayloadChange = useCallback((shopPayload) => {
    setShopPayload(shopPayload);
  }, []);

  const handleCopyButton = useCallback(() => {
    navigator.clipboard.writeText(mechanicTemplate);
    toast.success("Copied Mechanic template to clipboard", {
      duration: 2000,
    });
  }, []);

  const data = {
    transactions: [],
    order: orderPayload ? JSON.parse(orderPayload) : "",
    shop: shopPayload ? JSON.parse(shopPayload) : defaultShopPayload,
  };
  if (data.order && data.order.line_items) {
    data.subtotal_line_items = data.order.line_items;
    for (let line of data.subtotal_line_items) {
      line.final_line_price = line.price * line.quantity;
    }
  }

  const { status, markup } = useLiquid(mechanicTemplate, data);

  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Toaster />
        <Page
          title="Shopify To Mechanic Email Template Converter"
          primaryAction={{
            content: "Copy",
            icon: ClipboardIcon,
            disabled: shopifyTemplate ? false : true,
            onAction: handleCopyButton,
          }}
          subtitle="Easily convert your Shopify email notification liquid templates to liquid that can be used in Mechanic tasks"
        >
          <BlockStack gap="500">
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card sectioned>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingSm">
                      Shopify Template
                    </Text>
                    <TextField
                      maxHeight="150px"
                      value={shopifyTemplate}
                      onChange={handleShopifyTemplateChange}
                      multiline={8}
                      autoComplete="off"
                    />
                  </BlockStack>
                </Card>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card sectioned>
                  <BlockStack gap="300">
                    <InlineStack align="space-between">
                      <Text as="h2" variant="headingSm">
                        Generated Mechanic template
                      </Text>
                    </InlineStack>
                    <TextField
                      maxHeight="150px"
                      disabled
                      value={mechanicTemplate}
                      multiline={8}
                      autoComplete="off"
                    />
                  </BlockStack>
                </Card>
              </Grid.Cell>
            </Grid>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card sectioned>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingSm">
                      Order Payload
                    </Text>
                    <TextField
                      maxHeight="150px"
                      value={orderPayload}
                      onChange={handleOrderPayloadChange}
                      multiline={8}
                      autoComplete="off"
                    />
                  </BlockStack>
                </Card>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card>
                  <BlockStack gap="300">
                    <Text as="h2" variant="headingSm">
                      Shop Details
                    </Text>
                    <TextField
                      maxHeight="150px"
                      value={shopPayload}
                      onChange={handleShopPayloadChange}
                      multiline={8}
                      autoComplete="off"
                    />
                  </BlockStack>
                </Card>
              </Grid.Cell>
            </Grid>
            <Card>
              <Text as="h2" variant="headingSm">
                Preview
              </Text>
              <iframe
                id="email-preview"
                srcDoc={
                  markup
                    ? markup.replace(
                        "/assets/notifications/styles.css",
                        homepageUrl + "/email-styles.css"
                      )
                    : ""
                }
                width="100%"
                height="1100"
              ></iframe>
            </Card>
          </BlockStack>
          <FooterHelp>
            This is an{" "}
            <Link
              monochrome
              url="https://github.com/kalenjordan/mechanic-email-migrator"
            >
              open source project
            </Link>{" "}
            sponsored by{" "}
            <Link monochrome url="https://mechanic.dev/">
              Mechanic
            </Link>
            .
          </FooterHelp>
        </Page>
      </Frame>
    </AppProvider>
  );
}

export default App;
