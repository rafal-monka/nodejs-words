//Product
module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("token", {      
        device: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: false
        }, 
        token: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: false
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
  
    return Token;
  };