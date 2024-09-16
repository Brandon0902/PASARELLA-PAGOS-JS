const { DataTypes } = require('sequelize');
const db = require('../config/database')

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


Plane.hasMany(Benefit);
Plane.hasMany(SubscriptionPrice);
SubscriptionPrice.belongsTo(SubscriptionType);


module.exports = {
    Plane,
    Benefit,
    SubscriptionType,
    SubscriptionPrice
}