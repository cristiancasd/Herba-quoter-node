
 const initialQuoters=[
    {
        id: 'loseweight-minimum',
        title: "Lose Weight-Minimum",
        description: "",
        products:[
            {
                sku:"0146", //batido
                quantity:2,
            },
            {
                sku:"2870", //te 51gr
                quantity:1,
            },
        ],
        image:"loseweight-minimum.jpg"
    },

    {
        id: 'loseweight-medium',
        title: "Lose Weight-Medium",
        description: "",
        products:[
            {
                sku:"0146", //batido
                quantity:2,
            },
            {
                sku:"2870", //te 51gr
                quantity:1,
            },
            {
                sku:"0006", //te aloe
                quantity:1,
            }
        ],
        image:"loseweight-medium.jpg"
    },
    {
        id: 'loseweight-full',
        title: "Lose Weight-Full",
        description: "",
        products:[
            {
                sku:"0146", //batido
                quantity:2,
            },
            {
                sku:"2870", //te 51gr
                quantity:1,
            },
            {
                sku:"0006", //te aloe
                quantity:1,
            },
            {
                sku:"2864", //te Prote PPP
                quantity:1,
            },
            {
                sku:"2863", //te Fibra
                quantity:1,
            },

        ],
        image:"loseweight-full.jpg"
    },

]

const initialData=()=>{
    return initialQuoters
}

module.exports={initialData}