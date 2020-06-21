const getCurrentSubscription = (planName) => {
    const subscriptions = {
        "basic": {
            validityInDays: 7,
            price: "5.00",
            name: "7 Days Subscription",
            sku: "7 Days Subscription",
            currency: "USD",
            quantity: 1,
        },
        "pro": {
            validityInDays: 30,
            price: "10.00",
            name: "30 Days Subscription",
            sku: "30 Days Subscription",
            currency: "USD",
            quantity: 1,
            description: "This Subscription will be valid for 30 days."
        }
    };

    return subscriptions[planName];
};

export default getCurrentSubscription;