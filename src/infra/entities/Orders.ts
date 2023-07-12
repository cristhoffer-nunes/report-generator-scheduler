export class Orders {
	totalResults: number
	total: number
	offset: number
	limit: number
	links: [
		{
			rel: string
			href: string
		},
		{
			rel: string
			href: string
		}
	]
	sort: [
		{
			property: string
			order: string
		}
	]
	items: [
		{
			id: string
			submittedDate: string | null
			Pedido_SAP: string | null
			commerceItems: [
				{
					priceInfo: {
						orderDiscountInfos: [
							{
								couponCodes: [string]
							}
						]
					}
				}
			]
			client_document: string
			priceInfo: {
				secondaryCurrencyTaxAmount: number
				discounted: boolean
				secondaryCurrencyShippingAmount: number
				amount: number
				secondaryCurrencyTotal: number
				manualAdjustmentTotal: number
				discountAmount: number
				tax: number
				rawSubtotal: number
				total: number
				shipping: number
				primaryCurrencyTotal: number
				amountIsFinal: boolean
				orderTotalBySite: {
					siteUS: number
				}
				currencyCode: string
			}
		}
	]
}
