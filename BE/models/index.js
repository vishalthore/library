const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

const db = {
  sequelize,
  Sequelize,
  Subject: require('./Subject')(sequelize, Sequelize),
  Book: require('./Book')(sequelize, Sequelize),
  User: require('./User')(sequelize, Sequelize)
};

// Define relationships
db.Subject.hasMany(db.Book, { foreignKey: 'subjectId' });
db.Book.belongsTo(db.Subject, { foreignKey: 'subjectId' });

module.exports = db;