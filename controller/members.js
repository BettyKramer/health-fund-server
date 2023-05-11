const validate = require('../validatior.js');
const myCon = require('../mysql');

// get all members
function GetAll(req, res) {
    try {
        const getMemberById = 'SELECT * from members_tbl';
        const member = myCon.con.query(getMemberById, function (err, results) {
            if (err) throw err;
            res.send(results);
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

// get spesific member By ID
function GetMemberById(req, res) {
    try {
        const memberid = req.params.id;
        const getMemberById = `SELECT * from members_tbl where id = '${memberid}'`;
        const member = myCon.con.query(getMemberById, function (err, results) {
            if (err) throw err;
            res.send(results)
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

//check if memeber already exixis in DB
async function checkIfMemberExist(id, callback) {
    try {
        const checkMember = `SELECT id from members_tbl where id = ${id}`;
        myCon.con.query(checkMember, function (err, result) {
            if (err) throw err;
            if (result != null && result[0] != null)
                return callback(result[0].id);

            return callback(0);
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

// route add new member
async function addMemberToDB(req, res) {
    try {
        let {
            id,
            firstName,
            lastName,
            city,
            street,
            streetNumber,
            birthDay,
            phone,
            telephone,
        } = req.query;

        let missings = [];

        //check id has only numbers and length = 9
        const status = await validate.checkNumbers(id, "id", 9, 9, missings);
        if (status) {
            checkIfMemberExist(id, function (result) {

                const memeber_id = result;

                //checks if that id is already exist
                if (parseInt(memeber_id) > 0) {
                    missings.push("id already exists");

                    return res.json({
                        success: false,
                        message: `${missings.join(",")}`,
                    });
                }//if parseInt

                //validate all query params 
                validate.checkString(firstName, "firstName", 20, 1, missings)
                validate.checkString(lastName, "lastName", 20, 1, missings);
                validate.checkString(city, "city", 20, 1, missings);
                validate.checkString(street, "street", 20, 1, missings);
                validate.checkNumbers(streetNumber, "streetNumber", 3, 1, missings);
                validate.checkDate(birthDay, "birthDay", missings);
                validate.checkPhoneNumbers(phone, "phone", 10, 10, missings);
                validate.checkPhoneNumbers(telephone, "telephone", 10, 10, missings);

                //if something is missing or not validates
                if (missings.length > 0 && missings[0] != null) {
                    return res.json({
                        success: false,
                        message: `${missings.join(",")}`,
                    });
                }

                //if all validated insert to DB new member
                const addMember = `INSERT INTO members_tbl ( id, firstName, lastName,city,street,streetNumber,birthDay,phone,telephone) ` +
                    `VALUES (${id},'${firstName}','${lastName}','${city}','${street}',${streetNumber},'${birthDay}','${phone}','${telephone}')`;

                myCon.con.query(addMember, function (err, result) {
                    return res.json({
                        success: true,
                        message: `Memeber was added.`,
                    });
                }); //query
            }); //query
        }// if validate

        else { // id was not valid
            if (missings.length > 0 && missings[0] != null) {
                return res.json({
                    success: false,
                    message: `${missings.join(",")}`,
                });
            }
        }
    } //end of try
    catch (err) {
        console.log(err);
        return false;
    }
}
module.exports = { GetAll, addMemberToDB, checkIfMemberExist, GetMemberById }