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
		}
	]
}
