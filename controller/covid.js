const myCon = require('../mysql');
const validate = require('../validatior.js');
const members = require('./members.js');

//get all vaccinations
function GetAllVacc(req, res) {
    try {
        const GetVacc = 'SELECT * from infected_tbl';
        myCon.con.query(GetVacc, function (err, result) {
            if (err) throw err;
            if (result && result[0] != null)
                res.send(result);
            else
                res.send("no vaccinates");
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}


//get a specific vaccination by member id
async function getInfectionByMemberId(req, res) {
    try {
        const id = req.params.id;
        const getByID = `SELECT * from infected_tbl where memberId = '${id}'`;

        myCon.con.query(getByID, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

//add a vaccination to db
async function addInfectedToDB(req, res) {
    try {
        let {
            id,
            infectedDate,
            recoveryDate,
        } = req.query;

        let missings = [];

        if (validate.checkNumbers(id, "id", 9, 9, missings)) {

            //chcks if that member is really exists
            await members.checkIfMemberExist(id, function (result) {
                const memeber_id = result;

                if (parseInt(memeber_id) == 0) {
                    missings.push("id not exists");

                    return res.json({
                        success: false,
                        message: `${missings.join(",")}`,
                    });
                }
                
                //checks if the dates are validate
                validate.checkDate(recoveryDate, "recoveryDate", missings);
                validate.checkDate(infectedDate, "infectedDate", missings);

                //if something is missing or not valid returns a messege with the problem
                if (missings.length > 0 && missings[0] != null) {
                    return res.json({
                        success: false,
                        message: `${missings.join(",")}`,
                    });
                }
                //inserting to the db
                const addInfected = `INSERT INTO infected_tbl (memberId,infectedDate,recoveryDate) ` +
                    `VALUES (${id},'${infectedDate}','${recoveryDate}')`;
                myCon.con.query(addInfected)

                return res.json({
                    success: true,
                    message: `Covid data was added.`,
                });
            }); //end if memmber exist
        } //end if validate
    }//end of try
    catch (err) {
        console.log(err);
        return false;
    }
}
module.exports = { addInfectedToDB, GetAllVacc, getInfectionByMemberId }