const json2csv = require('json2csv')
const fs = require('fs')

//Class qui va convertire un json en
class convertToCsv {
  constructor(json) {
    if(typeof json == "object") {
      if(Array.isArray(json)) {
        if(json.length > 0) {
          this.json = json
        } else {
          console.log("convertToCsv neew a array not empty")
        }
      } else {
        console.error("convertToCsv need a array")
      }
    }else {
      console.error("convertToCsv need a array. pls consult your var")
    }
  }

  async startConvert(name) {
    try {
      return await this.write(name, json2csv({data:this.json,fields:Object.keys(this.json[0]),del:";",quotes:"",newLine:"\n"}))
    } catch (err) {
      console.error(err)
      return false
    }
  }

  write(name, csv) {
    return new Promise(function(resolve, reject) {
      fs.writeFile(name, csv, function(err) {
        if(err) reject(Error(err))
        resolve(true)
      })
    })
  }

}

module.exports = convertToCsv;
