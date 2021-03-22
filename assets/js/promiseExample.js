            fetch(`${(typeof proxyUrl !== "undefined") ? proxyUrl : ''}https://api.captivatenetwork.com/api/v1/content/data/QA2012/7,8`, {
                    method: 'GET',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                        }
                    }).then(
                            function(response){
                            console.log("DYNAMIC DATA REQUEST MDE");
                            console.log("DYNAMIC DATA REQUEST MDE2");
                        if (response.status !== 200) {
                            console.log('Issue with GET. Status Code: ' +
                              response.status);
                            return;
                        }
                        // Examine the text in the response
                        response.json().then(function(data) {
                       
                       
                            console.log("DYNAMIC DATA");
                            console.log(data[0].DynamicValue);
                            console.log("DYNAMIC Value");
                            console.log(data[0].DynamicID);
                            console.log("DYNAMIC Value 2");
                            //console.log((common.fileManager.getAndParseXmlFiles([data])).findDescendantNodeByName("DynamicValue"));
                           
                            dynamicElement.innerHTML = data[0].DynamicValue;
                           
                           
                          }).then(function(){
                           
                            //Do things/make decisions. The world is your oyster.               
                         
                          }