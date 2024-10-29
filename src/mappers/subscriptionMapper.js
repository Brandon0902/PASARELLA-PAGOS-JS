const moment = require('moment')
const { NotFoundError } = require('../handlers/errors')

const toSubscriptionEntity = (userId, paymentData, hasTrialDays) => {
    const paymentMethodId = 1;
    return {
        userId: userId,
        paymentMethodId: paymentMethodId,
        paymentPlatformId: paymentData.id,
        referenceId: paymentData.subscriptionId,
        hasTrialDays: hasTrialDays,
        state: hasTrialDays ? 'ACTIVE' : 'PENDING'
    };
}

const calculateEndDate = (subscriptionType, hasTrialDays, plane, startDate) => {
    if (hasTrialDays) {
        return moment(startDate).utc().add(plane.trialDays, 'day');
    }

    switch (subscriptionType) {
        case 'MONTHLY':
            return moment(startDate).utc().add(1, 'month');
        case 'YEARLY':
            return moment(startDate).utc().add(1, 'year');
    }

    return null;
}

const toSubscriptionPeriodEntity = (subscription, subscriptionType, prices, hasTrialDays, plane) => {
    const startDate = moment().utc();
    return {
        subscriptionId: subscription.id,
        planeId: prices.planeId,
        subscriptionTypeId: prices.subscriptionTypeId,
        price: prices.price,
        state: hasTrialDays ? 'ACTIVE' : 'PENDING',
        startDate: startDate,
        endDate: calculateEndDate(subscriptionType.code, hasTrialDays, plane, startDate)
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


const toSubscriptionPeriodEntity1 = (subscriptionPeriod, data) => {
    return {
        state: data.state || subscriptionPeriod.state,
        errorDetails: data.errorDetails || subscriptionPeriod.errorDetails,
        endDate: data.endDate || subscriptionPeriod.endDate,
        updatedAt: moment().utc(),
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
        updatedAt: moment().utc()
    }
}

const toCancelSubscriptionEntity = () => {
    return {
        state: 'CANCELED',
        endDate: moment().utc(),
        updatedAt: moment().utc()
    }
}

const toEndedSubscriptionPeriodEntity = () => {
    return {
        state: 'ENDED',
        endDate: moment().utc(),
    }
}

const getPeriod = async(subscription) => {

    if (subscription.lastPeriod === undefined) {
        const result = await subscription.getPeriods()
        const first = result.filter(item => item.state === 'ACTIVE' || item.state === 'PENDING').pop()

        if (!first) {
            throw new NotFoundError(`error to trying current period for suscription ${subscription.id}`)
        }

        return first
    }

    return subscription.lastPeriod
}

const toSubscription = async (subscription, user, period = null) => {
    const lastPeriod = period || await getPeriod(subscription)
    const plane = await lastPeriod.getPlane()
    
    return {
        id: subscription.id,
        user: user,
        planeName: plane.name,
        endDate: subscription.endDate,
        renewDate: moment(lastPeriod.endDate).format('DD/MM/YYYY'),
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
    toSubscription,
    calculateEndDate,
    getPeriod,
}