//Product
module.exports = (sequelize, Sequelize) => {
    const Word = sequelize.define("word", {      
      phrase: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
      },      
      sentence: {
        type: Sequelize.STRING,
        allowNull: true
      },
      translation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tags: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      counter: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },     
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false 
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true 
      }
    });
  
    return Word;
  };