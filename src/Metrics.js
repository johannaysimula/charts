// Get the button and container elements from HTML:

// Create an array of cars to send to the server:
const command2 = [
	{ "command":'metrics', "mode":'work' }
];



function preparePredicatesData(response){
  //data2.innerHTML += "<p>" + "response in " + response;
  var len=response.length;
  var last=response.at(len-1);
  response.splice(1,len-1);
  response.push(last+1);
  //data2.innerHTML += "<p>" + "response " + response;
  return(response);
}


function prepareMetricsData(response){

  var list=[];
  var listT=[];
  var paddedlist=[];
  var numberofTimesteps=0;

  //data2.innerHTML += "<p> prepareData"; 
  //data2.innerHTML += "<p> response" + response;
  //response.map(e=>data2.innerHTML += "<p> response e" +  e[0]);

  response.map(e=>(listT.push(e.T), list.push(e.metric)));
  //data2.innerHTML += "<p> response" +  response;
  numberofTimesteps=listT.length;
  //data2.innerHTML += "<p> numberofTimesteps" +  numberofTimesteps;
  console.log("prepareMetricsData input: ",response)
  for (let i=0; i< numberofTimesteps; i++){   
    console.log("i: ",i)                          
    for (let j=listT[i]; j< listT[i+1]; j++){      
      paddedlist[j]=list[i];  
      console.log("paddedlist: ", paddedlist)    
    }
    
  }
  paddedlist[listT[numberofTimesteps-1]]=list[numberofTimesteps-1];

  //data2.innerHTML += "<p>" + "paddedlist " + paddedlist + " " + listT[listT.length-1];
  console.log("prepareMetricsData paddedlist: ", paddedlist)
  return(paddedlist);

};
//var responseListBenefitrealized=[];
//var responseListBenefitrealizedT=[];

// Create an event listener on the button element:
function Metrics(){
  var jsonResponseBenefit=[];
  var jsonResponseCost=[];
  var jsonResponseBenefitCost=[];
    // Get the reciever endpoint from Python using fetch:
    fetch("http://127.0.0.1:5001/receiver",
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            // Strigify the payload into JSON:
            body:JSON.stringify(command2)}).then(res=>{
                if(res.ok){
                    return res.json()
                }else{
                    alert("something is wrong")
                }
            }).then(jsonResponse=>{

              console.log("jsonResponse: ", jsonResponse)
              var jsonResponseListBacklogA=[]; 
              var jsonResponseListBacklogB=[];
              var jsonResponseListBacklogC=[];
              var la=[]; 
              var lb=[];
              var lc=[];             
              
              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inbacklog(a)').map(e=>la.push(e.T));
              jsonResponseListBacklogA=preparePredicatesData(la); 
                            
              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inbacklog(b)').map(e=>lb.push(e.T));
              jsonResponseListBacklogB=preparePredicatesData(lb);

              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inbacklog(c)').map(e=>lc.push(e.T));
              jsonResponseListBacklogC=preparePredicatesData(lc); 


              la=[]; 
              lb=[];
              lc=[];  

              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inconstruction(a)').map(e=>la.push(e.T));
              var jsonResponseListConstructionA=preparePredicatesData(la); 
                            
              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inconstruction(b)').map(e=>lb.push(e.T));
              var jsonResponseListConstructionB=preparePredicatesData(lb);

              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inconstruction(c)').map(e=>lc.push(e.T));
              var jsonResponseListConstructionC=preparePredicatesData(lc); 


              la=[]; 
              lb=[];
              lc=[];  

              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inproduction(a)').map(e=>la.push(e.T));
              var jsonResponseListProductionA=preparePredicatesData(la); 
                            
              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inproduction(b)').map(e=>lb.push(e.T));
              var jsonResponseListProductionB=preparePredicatesData(lb);

              jsonResponse.find(e=>e.theme ==='predicates').data.filter(e=>e.holds==='inproduction(c)').map(e=>lc.push(e.T));
              var jsonResponseListProductionC=preparePredicatesData(lc); 
                
                
                
                
              
              if (false){          
              timelineChart.updateSeries([{name: 'Epic A',data: [
                {
                  x: 'Production',
                  y: jsonResponseListProductionA
                },
                {
                  x: 'Construction',
                  y: jsonResponseListConstructionA
                },
                {
                  x: 'Backlog',
                  y: jsonResponseListBacklogA
                }
              ]},
              {name: 'Epic B',data: [
                {
                  x: 'Production',
                  y: jsonResponseListProductionB
                },
                {
                  x: 'Construction',
                  y: jsonResponseListConstructionB
                },
                {
                  x: 'Backlog',
                  y: jsonResponseListBacklogB
                }
              ]},
              {name: 'Epic C',data: [
                {
                  x: 'Production',
                  y: jsonResponseListProductionC
                },
                {
                  x: 'Construction',
                  y: jsonResponseListConstructionC
                },
                {
                  x: 'Backlog',
                  y: jsonResponseListBacklogC
                }
              ]},
              {name: 'Epic D',data: [
                {
                  x: 'Production',
                  y: jsonResponseListProductionC
                },
                {
                  x: 'Construction',
                  y: jsonResponseListConstructionC
                },
                {
                  x: 'Backlog',
                  y: jsonResponseListBacklogC
                }
              ]}])
            }

            //timelineChart.appendSeries({name: 'Epic E',data: [0,4]})
              
            if (false){  
            timelineChart.appendSeries({name: 'Epic E',data: [
                {
                  x: 'Production',
                  y: [0,4]
                },
                {
                  x: 'Construction',
                  y: [0,4]
                },
                {
                  x: 'Backlog',
                  y: [0,4]
                }
              ]})
            }

              // Now for the metrics
              console.log("Now for the metrics", jsonResponse)

              

              jsonResponseBenefit=prepareMetricsData(jsonResponse.find(e=>e.theme ==='benefit').data);
              console.log("jsonResponseBenefit: ", jsonResponseBenefit)
              jsonResponseCost=prepareMetricsData(jsonResponse.find(e=>e.theme ==='cost').data);
              console.log("jsonResponseCost: ", jsonResponseCost)
              
              
              
              for (let i=0; i< jsonResponseCost.length; i++){
                jsonResponseBenefitCost[i]=(jsonResponseCost[i]===0 ? 0 : jsonResponseBenefit[i]/jsonResponseCost[i])
              }
              console.log("jsonResponseBenefitCost: ", jsonResponseBenefitCost)
              //return(jsonResponseBenefit)
              //data2.innerHTML += "<p> jsonResponseBenefitCost " + jsonResponseBenefitCost

                //for (let item of jsonResponse) data2.innerHTML += "<p> jsonResponse" + item
                //for (let item of jsonResponseBenefit) data2.innerHTML += "<p> jsonResponseBenefit" + item.metric + " " + item.T
              return({benefit: jsonResponseBenefit, cost: jsonResponseCost, benefitcost: jsonResponseBenefitCost });
        
                }
                
        ).catch((err) => console.error(err));
        //return({benefit: jsonResponseBenefit, cost: jsonResponseCost, benefitcost: jsonResponseBenefitCost })
        console.log("jsonResponseBenefit: ", jsonResponseBenefit)
        //return(jsonResponseBenefit)
        
    }

    export default Metrics;