//Product
module.exports = (sequelize, Sequelize) => {
    const Word = sequelize.define("word", {      
      phrase: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: false
      },   
      hws: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      speechpart: {
        type: Sequelize.STRING(255),
        allowNull: true
      },          
      sentence: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      translation: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      examples: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      counter: {
        type: Sequelize.DECIMAL,
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