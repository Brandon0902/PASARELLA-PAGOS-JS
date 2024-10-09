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

const calculateEndDate = (subscriptionType, hasTrialDays, plane, startDate) => {
    if (hasTrialDays) {
        return moment(startDate).add(plane.trialDays, 'day');
    }

    switch (subscriptionType) {
        case 'MONTHLY':
            return moment(startDate).add(1, 'month');
        case 'YEARLY':
            return moment(startDate).add(1, 'year');
    }

    return null;
}

const toSubscriptionPeriodEntity = (subscription, prices, hasTrialDays, plane) => {
    const startDate = moment();
    return {
        subscriptionId: subscription.id,
        planeId: prices.planeId,
        subscriptionTypeId: prices.subscriptionTypeId,
        price: prices.price,
        state: hasTrialDays ? 'ACTIVE' : 'PENDING',
        startDate: startDate,
        endDate: calculateEndDate(subscription.subscriptionType.code, hasTrialDays, plane, startDate)
    };
}

const toNextSubscriptionPeriodEntity = (subscription, currentPeriod, subscriptionType, plane) => {
    const startDate = currentPeriod.endDate;
    return {
        subscriptionId: subscription.id,
        planeId: currentPeriod.planeId,
        subscriptionTypeId: currentPeriod.subscriptionTypeId,
        price: currentPeriod.price,
        state: 'ACTIVE',
        startDate: startDate,
        endDate: calculateEndDate(subscriptionType.code, false, plane, startDate)
    };
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