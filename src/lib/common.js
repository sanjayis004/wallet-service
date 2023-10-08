const SnowflakeId = require('snowflake-id').default;


module.exports.generateSnowFlakeUniqueId = (machineId = 1) => {

    let snowFlakeId = new SnowflakeId({
        mid: machineId,
        offset: (2022 - 1970) * 31536000 * 1000,
    })
    return snowFlakeId.generate()

}