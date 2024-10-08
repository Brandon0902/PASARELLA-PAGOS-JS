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

const calculateEndDate = (subscriptionType, hasTrialDays, plane, startDate = moment()) => {
    
    if (hasTrialDays) {
        return moment(startDate).add(plane.trialDays, 'day');
    }

    switch(subscriptionType) {
        case 'MONTHLY': 
            return moment(startDate).add(1, 'month');
        case 'YEARLY': 
            return moment(startDate).add(1, 'year');
    }

    return null;
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
    };
}

const toNextSubscriptionPeriodEntity = (subscription, currentPeriod, subscriptionType, plane) => {
    return {
        subscriptionId: subscription.id,
        planeId: currentPeriod.planeId,
        subscriptionTypeId: currentPeriod.subscriptionTypeId,
        price: currentPeriod.price,
        state: 'ACTIVE',
        startDate: currentPeriod.endDate,
        endDate: calculateEndDate(subscriptionType.code, false, plane, currentPeriod.endDate)
    }
}


const toSubscriptionPeriodEntity1 = (subscriptionPeriod, state, errorDetails = null, endDate = null) => {
    return {
        state: state || subscriptionPeriod.state,
        errorDetails,
        endDate: endDate || subscriptionPeriod.endDate 
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

const toSubscriptionEntity1 = (subscription, state, endDate = null) => {
    return {
        state: state,
        endDate: endDate || subscription.endDate,
        updatedAt: moment()
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
    toEndedSubscriptionPeriodEntity,
    toSubscriptionEntity1,
    toSubscriptionPeriodEntity1,
    toNextSubscriptionPeriodEntity
}