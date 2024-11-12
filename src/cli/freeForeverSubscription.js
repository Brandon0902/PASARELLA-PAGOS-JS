const moment = require('moment')
const PlaneService = require('../services/planeService')
const SubscriptionTypeService = require('../services/subscriptionTypeService')
const SubscriptionRepository = require('../repositories/subscriptionRepository')
const SubscriptionPeriodRespository = require('../repositories/subscriptionPeriodRepository')
const { sequelize } = require('../config/database')
const { NotFoundError } = require('../handlers/errors')

const HUNDRED_YEARS = 100
const DUMMY_PAYMENT_PLATFORM_ID = 1 
const MONTHLY_SUBSCRIPTION_TYPE_ID = 1

/**
 * Crea entidad de suscripción con valores predefinidos para suscripciones gratuitas
 */
const createSubscriptionEntity = (userId) => {
    return {
        userId,
        paymentMethodId: 1,
        paymentPlatformId: DUMMY_PAYMENT_PLATFORM_ID,
        referenceId: `FREE-FOREVER-${userId}`,
        hasTrialDays: false,
        state: 'ACTIVE',
        endDate: moment().utc().add(HUNDRED_YEARS, 'years').toDate()
    }
}

/**
 * Crea entidad de período de suscripción
 */
const createPeriodEntity = (subscription, subscriptionType, plane) => {
    const startDate = moment().utc()
    const endDate = moment().utc().add(HUNDRED_YEARS, 'years')

    return {
        subscriptionId: subscription.id,
        planeId: plane.id,
        subscriptionTypeId: subscriptionType.id,
        price: 0, // Suscripción gratuita
        state: 'ACTIVE',
        startDate: startDate.toDate(),
        endDate: endDate.toDate()
    }
}

/**
 * Crea una suscripción gratuita permanente para un usuario
 */
const createFreeSubscription = async (userId, plane, subscriptionType) => {
    const t = await sequelize.transaction()

    try {
        
        // Crear suscripción
        const subscription = createSubscriptionEntity(userId)
        const subscriptionCreated = await SubscriptionRepository.create(subscription, t)
        
        // Crear período de suscripción
        const period = createPeriodEntity(subscriptionCreated, subscriptionType, plane)
        await SubscriptionPeriodRespository.create(period, t)

        await t.commit()
        console.log(`✅ Suscripción gratuita creada exitosamente para el usuario ${userId}`)
        
        return subscriptionCreated
    } catch (error) {
        await t.rollback()
        throw new Error(`Error al crear la suscripción para el usuario ${userId}: ${error.message}`)
    }
}

/**
 * Función principal para crear suscripciones gratuitas permanentes para múltiples usuarios
 */
const createFreeForeverSubscriptions = async (userIds, planeId) => {
    // Validar argumentos
    if (!userIds || !planeId) {
        console.error('⚠️  Argumentos requeridos: lista de IDs de usuarios (separados por coma) y ID del plan')
        process.exit(1)
    }

    try {
        // Convertir IDs de usuarios
        const userIdList = userIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        
        if (userIdList.length === 0) {
            throw new Error('No se proporcionaron IDs de usuario válidos')
        }

        // Obtener plan
        const plane = await PlaneService.getById(planeId)
        if (!plane) {
            throw new NotFoundError(`No se encontró el plan con ID ${planeId}`)
        }

        // Obtener tipo de suscripción
        const subscriptionType = await SubscriptionTypeService.getById(MONTHLY_SUBSCRIPTION_TYPE_ID)
        if (!subscriptionType) {
            throw new NotFoundError('No se encontró el tipo de suscripción mensual')
        }

        // Procesar cada usuario
        for (const userId of userIdList) {
            try {
                await createFreeSubscription(userId, plane, subscriptionType)
            } catch (error) {
                console.error(`❌ Error al procesar usuario ${userId}:`, error.message)
                // Continuar con el siguiente usuario aunque uno falle
            }
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message)
        process.exit(1)
    }
}

if (require.main === module) {
    const [,, userIds, planeId] = process.argv
    createFreeForeverSubscriptions(userIds, parseInt(planeId))
        .finally(() => process.exit(0))
}

module.exports = { createFreeForeverSubscriptions }