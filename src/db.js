const db = require(__dirname + "/../modules/mysql-connect");

(async () => {
    const [results, fields] = await db.query(
        "SELECT * FROM `memberdata` LIMIT 5"
    );

    console.log(results);
    // console.log(fields);

    process.exit(); //相當於php的exit();結束行程
})();
