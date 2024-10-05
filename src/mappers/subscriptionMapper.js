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
    
    if (hasTrialDays) {
        return moment().add(plane.trialDays, 'day')
    }

    switch(subscriptionType) {
        case 'MONTHLY': return moment().add(1, 'month')
        case 'YEARLY': return moment().add(1, 'year')
    }

    return null
}

const toSubscriptionPeriodEntity = (subscription, subscriptionType, prices, hasTrialDays, plane) => {
    return {
        subscriptionId: subscription.id,
        planeId: prices.planeId,
        subscriptionTypeId: prices.subscriptionTypeId,
        price: prices.price,
        state: hasTrialDays ? 'ACTIVE' : 'PENDING',
        startDate: moment(),
        endDate: calculateEndDate(subscriptionType.code, hasTrialDays, plane)
    }
}

const toNextSubscriptionPeriodEntity = (subscription, currentPeriod, subscriptionType) => {
    return {
        subscriptionId: subscription.id,
        planeId: currentPeriod.planeId,
        subscriptionTypeId: currentPeriod.subscriptionTypeId,
        price: currentPeriod.price,
        state: 'ACTIVE',
        startDate: currentPeriod.endDate,
        endDate: calculateEndDate(subscriptionType.code, false, currentPeriod.planeId)
    };
}

const toSubscriptionPeriodEntity1 = (subscriptionPeriod, state, errorDetails = null, endDate = null) => {
    return {
        state: state || subscriptionPeriod.state,
        errorDetails,
        endDate: endDate || subscriptionPeriod.endDate 
    }
}

const toUserPaymentPlatformEntity = (paymentPlatformId, user, paymentData) => {
    return {
        userId: user.id,
        paymentPlatformId,
        referenceId: paymentData.customerId,
        data: {
            email: user.email
        },
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

const getPeriod = async(subscription) => {

    if (subscription.lastPeriod === undefined) {
        const result = await subscription.getPeriods()
        const first = result.filter(item => item.state === 'ACTIVE' || item.state === 'PENDING').pop()

        if (!first) {
            throw new Error('error to trying current period')
        }

        return first
    }

    return subscription.lastPeriod
}

const toSubscription = async (subscription, user) => {
    const period = await getPeriod(subscription)
    const plane = await period.getPlane()
    
    return {
        id: subscription.id,
        user: user,
        planeName: plane.name,
        endDate: moment(period.endDate).format('DD/MM/YYYY'),
        paymentPlatformId: subscription.paymentPlatformId,
        referenceId: subscription.referenceId,
        state: subscription.state,
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
    toNextSubscriptionPeriodEntity,
    toSubscription
}