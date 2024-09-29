const moment = require('moment')

const toSubscriptionEntity = (userId, paymentData, hasTrialDays) => {
    return {
        userId: userId,
        paymentMethodId: 1,
        paymentPlatformId: paymentData.id,
        referenceId: paymentData.subscriptionId,
        hasTrialDays: hasTrialDays,
        state: hasTrialDays ? 'ACTIVE' : 'PENDING'
    }
}

const calculateEndDate = (subscriptionType, hasTrialDays, plane) => {
    
    if(hasTrialDays)
        return moment().add(plane.trialDays, 'day')

    switch(subscriptionType) {
        case 'MONTHLY': return moment().add(1, 'month')
        case 'YEARLY': return moment().add(1, 'year')
    }

    return null
}

const toSubscriptionPeriodEntity = (subscription, prices, hasTrialDays, plane) => {
    return {
        subscriptionId: subscription.id,
        planeId: prices.planeId,
        subscriptionTypeId: prices.subscriptionTypeId,
        price: prices.price,
        state: hasTrialDays ? 'ACTIVE' : 'PENDING',
        startDate: moment(),
        endDate: calculateEndDate(subscription.subscriptionType.code, hasTrialDays, plane)
    }
}

const toUserPaymentPlatformEntity = (paymentPlatformId, userId, paymentData) => {
    return {
        userId,
        paymentPlatformId,
        referenceId: paymentData.customerId,
        state: 'ACTIVE'
    }
}

const toCancelSubscriptionEntity = () => {
    return {
        state: 'CANCELED',
        endDate: moment(),
        updatedAt: moment()
    }
}

const toEndedSubscriptionPeriodEntity = () => {
    return {
        state: 'ENDED',
        endDate: moment(),
        updatedAt: moment()
    }
}

module.exports = {
    toSubscriptionEntity,
    toSubscriptionPeriodEntity,
    toUserPaymentPlatformEntity,
    toCancelSubscriptionEntity,
    toEndedSubscriptionPeriodEntity
}