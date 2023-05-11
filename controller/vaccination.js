
const mySql = require('../mysql.js');
const validate = require('../validatior.js');
const members = require('./members.js');

//get all Vaccinations
function GetAllVaccination(req, res) {
    try {
        const GetVacc = "select members_tbl.id,dateOfVaccinate ,manufacturer_tbl.companyName " +
            "from vaccinate_tbl " +
            "inner join members_tbl on memberId = members_tbl.id " +
            "inner join manufacturer_tbl on manufacturer_tbl.id = manufacturerId " +
            "order by members_tbl.id,dateOfVaccinate;";

        mySql.con.query(GetVacc, function (err, result) {
            if (err) throw err;
            res.send(result)
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

//get Vaccination of a specific member by id
async function getVaccinationById(req, res) {
    try {
        const id = req.params.id;
        console.log(id);
        const getByID = `SELECT * from vaccinate_tbl where memberId = '${id}'`;

        mySql.con.query(getByID, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

//returns the id of a manufacturer by its name
async function getManufactureByName(manufactur, callback) {
    try {
        console.log(manufactur);
        const getByName = `SELECT id from manufacturer_tbl where companyName = '${manufactur}'`;

        const manufacture = mySql.con.query(getByName, function (err, result) {
            return callback(result);
        });


    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

//returns the amount of vaccinations that a specific memmber had
async function getCountVaccOfMember(id, callback) {
    try {
        const getById = `SELECT count(memberId) as totalvacc from vaccinate_tbl where memberId = ${id}`;
        mySql.con.query(getById, function (err, result) {
            return callback(result);
        });
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}

//add a vaccination to db
async function addMemberVaccinate(req, res) {
    try {
        let {
            id,
            vaccDay,
            vaccManufacturer,
        } = req.query;

        let missings = [];

        if (validate.checkNumbers(id, "id", 9, 9, missings)) {

            //checks if that member realy exists
            await members.checkIfMemberExist(id, function (result) {
                const memeber_id = result;

                if (parseInt(memeber_id) == 0) {
                    missings.push("id not exists");

                    return res.json({
                        success: false,
                        message: `${missings.join(",")}`,
                    });
                }

                //validate the params
                validate.checkString(vaccManufacturer, "vaccManufacturer", 20, 1, missings)
                validate.checkDate(vaccDay, "vaccDay", missings)

                //if something is missing or not validate returns a messege
                if (missings.length > 0 && missings[0] != null) {
                    return res.json({
                        success: false,
                        message: `${missings.join(",")}`,
                    });
                }

                //check if the member has less then 4 vaccinations
                getCountVaccOfMember(id, function (result) {
                    const counter = result[0].totalvacc;

                    if (parseInt(counter) >= 4) {
                        missings.push("memeber got 4 vacc");

                        return res.json({
                            success: false,
                            message: `${missings.join(",")}`,
                        });
                    }

                    //get the id of the Manufacturer
                    getManufactureByName(vaccManufacturer, function (result) {
                        const manif_id = result[0].id;

                        if (parseInt(manif_id) == 0) {
                            missings.push("Manufacturer not exists");

                            return res.json({
                                success: false,
                                message: `${missings.join(",")}`,
                            });
                        }
                        //inserting to db
                        const insert = `insert into vaccinate_tbl (dateOfVaccinate,memberId,manufacturerId) values` +
                            `('${vaccDay}', ${id}, ${manif_id} );`;

                        mySql.con.query(insert);

                        return res.json({
                            success: true,
                            message: `Vaccinate was added.`,
                        });
                    });//end getManufactureByName
                });// end getCountVaccOfMember
            }); //end function checkIfMemberExist
        } //end if validate
    }//end of try
    catch (err) {
        console.log(err);
        return false;
    }
}
module.exports = { addMemberVaccinate, getVaccinationById, GetAllVaccination }