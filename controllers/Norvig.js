let norvig_url = "http://norvig.com/big.txt"
let dict_url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup"
const http = require("http");
const { string } = require("joi");
const sw = require('stopword')
const axios = require('axios');
const { count } = require("console");

exports.getData = async(req,res) =>{
    let map_data = {}
    let result = {}
    let data = ''
    let array_of_words = []
    let k = 10;
    let response_obj = []
    try {
        http.get(norvig_url, resp => {
            resp.setEncoding("utf8");
            resp.on("data", chunks => {
                data += chunks
            });
            resp.on("end", () => {
                // removing leading whitespaces
                data = data.replace(/^\s+|\s+$/g, '');
                //making everything lower case
                data = data.toLowerCase();
                // removing special character
                data = data
                .replace(/\s+/g, ' ')
                .replace(/[^\w\s]/gi, '')
                //converting into array
                array_of_words = data.split(" ")
                array_of_words = sw.removeStopwords(array_of_words)
                for (let word of array_of_words) {
                    if (map_data.hasOwnProperty(word)) {  
                        map_data[word] = map_data[word] + 1 
                    } else {
                        map_data[word] = 1
                    }
                }
                let result = Object.keys(map_data).sort((a,b)=>{
                    let countCompare = map_data[b] - map_data[a];
                    if (countCompare == 0) return a.localeCompare(b);
                    else return countCompare;
                });
                result = result.slice(0, k);
                let promiseObjs = [];
                let idx = 0;
                for (let word of result) {
                    let count = map_data[word]
                    // const obj = 
                    promiseObjs.push(
                        axios.get(dict_url, {
                            params: {
                              key: "dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf",
                              lang: "en-en",
                              text: word
                            }
                        })
                    )
                    promiseObjs[idx].then(function (response) {
                        if (response.data.def[0]) {
                            var temp_pos1 = JSON.stringify(response.data);
                            var data1 = JSON.parse(temp_pos1);
                            data1["count"] = count;
                            data1["word"] = word;
                            response_obj.push(data1)
                           
                        }else {
                            data1 = {}
                            data1["count"] = count;
                            data1["word"] = word;
                            data1["Error"] = "Not Found"
                            response_obj.push(data1)
                        }
                      
                    })
                    idx++;
                }
                Promise.all(promiseObjs).then(() => {
                    console.log(response_obj);
                    res.send({data : response_obj})
                  });
                
            });
            
        });
      
    } catch (err) {
        console.log("error ocurred",err);
        res.json({
          "code":400,
          "failed":err
        })
    }
}