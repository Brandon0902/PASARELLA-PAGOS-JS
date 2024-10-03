const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Plane = db.sequelize.define(
    'planes',
    {
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        trialDays: DataTypes.INTEGER,
        state: DataTypes.CHAR,
    },
    { timestamps: false, underscored: true }
);

const Benefit = db.sequelize.define(
    'benefits',
    {
        description: DataTypes.STRING,
        state: DataTypes.CHAR,
    },
    { timestamps: false, underscored: true }
);

const SubscriptionType = db.sequelize.define(
    'subscription_types',
    {
        name: DataTypes.STRING,
        code: DataTypes.STRING,
        state: DataTypes.CHAR,
    },
    { timestamps: false }
);

const SubscriptionPrice = db.sequelize.define(
    'subscription_prices',
    {
        price: DataTypes.FLOAT,
        state: DataTypes.CHAR,
        subscriptionTypeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'subscription_types',
                key: 'id'
            }
        }
    },
    { timestamps: false, underscored: true }
);

const PaymentPlatform = db.sequelize.define(
    'payment_platforms',
    {
        name: DataTypes.STRING,
        state: DataTypes.CHAR
    },
    { underscored: true, updatedAt: false }
);

const PaymentMethod = db.sequelize.define(
    'payment_platforms',
    {
        name: DataTypes.STRING,
        state: DataTypes.CHAR
    }
);

const UserPaymentPlatform = db.sequelize.define(
    'user_payment_platforms',
    {
        userId: DataTypes.INTEGER,
        paymentPlatformId: DataTypes.INTEGER,
        referenceId: DataTypes.STRING,
        data: DataTypes.JSONB,
        state: DataTypes.CHAR
    },
    { updatedAt: false, underscored: true }
);

const Subscription = db.sequelize.define(
    'subscriptions',
    {
        userId: DataTypes.INTEGER,
        paymentMethodId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'payment_methods',
                key: 'id'
            }
        },
        paymentPlatformId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'payment_platforms',
                key: 'id'
            }
        },
        hasTrialDays: DataTypes.BOOLEAN,
        referenceId: DataTypes.STRING,
        state: DataTypes.CHAR,
        endDate: DataTypes.DATE
    },
    { underscored: true }
);

const SubscriptionPeriod = db.sequelize.define(
    'subscription_periods',
    {
        subscriptionId: DataTypes.INTEGER,
        planeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'planes',
                key: 'id'
            }
        },
        subscriptionTypeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'subscription_types',
                key: 'id'
            }
        },
        price: DataTypes.FLOAT,
        referenceId: DataTypes.STRING,
        errorDetails: DataTypes.JSON,
        state: DataTypes.CHAR,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE
    },
    { underscored: true }
);

const PlanePaymentPlatform = db.sequelize.define(
    'plane_payment_platforms',
    {
        planeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'planes',
                key: 'id'
            }
        },
        subscriptionTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subscription_types',
                key: 'id'
            }
        },
        paymentPlatformId: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'payment_platforms',
                key: 'id'
            }
        },
        referenceId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },

    {
        updatedAt: false,
        underscored: true
    }
);

Plane.hasMany(Benefit);
Plane.hasMany(SubscriptionPrice);
SubscriptionPrice.belongsTo(SubscriptionType);
PlanePaymentPlatform.belongsTo(PaymentPlatform);
UserPaymentPlatform.belongsTo(PaymentPlatform);
SubscriptionPeriod.belongsTo(Plane)
Subscription.hasMany(SubscriptionPeriod, { as: 'periods' })


module.exports = {
    Plane,
    Benefit,
    SubscriptionType,
    SubscriptionPrice,
    PaymentPlatform,
    PaymentMethod,
    UserPaymentPlatform,
    Subscription,
    SubscriptionPeriod,
    PlanePaymentPlatform
};