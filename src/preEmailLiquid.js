const preEmailLiquid = `
{% assign order_name = order.name %}
`;

/*
TODO
  {% assign order.total_discounts | times: 100 = 0 %} - that's not good.
    there are otehr cases - basically any assign statement
*/

    /*
'subtotal_price': 'order.subtotal_price | times: 100',
    'total_order_discount_amount': 'order.total_discounts | times: 100',
    'shipping_price': 'order.total_shipping_price_set.shop_money.amount',
    // 'order_name': 'order.name',
    ' subtotal_line_items': ' order.line_items',
    'shipping_amount': 'order.total_shipping_price_set.shop_money.amount',
    'shipping_address': 'order.shipping_address',
    'billing_address': 'order.billing_address',
    'requires_shipping': 'order.requires_shipping', // need to iterate over line items to populate this
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

export default preEmailLiquid ;