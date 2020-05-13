const dbConfig = require("./config/db-config");

exports.test = ()=> {
    console.log('storage.test');
    try {
        //connect to the database
        let pool = dbConfig.getConnectionPool();         
        pool.query("SELECT NOW() as czas", [], function(error, data, fields) {
            if (error) throw error;    
            const results = JSON.parse(JSON.stringify(data));
            console.log("results", results);            
        });
    } catch (e) {
        console.log(e.toString());
    }  
}
