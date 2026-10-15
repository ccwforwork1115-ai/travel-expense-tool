const fs=require('fs'),vm=require('vm'),assert=require('assert');
let harness=fs.readFileSync('verify.cjs','utf8').split('(async()=>{')[0];
harness=harness.replace('vm.createContext(context);',`context.fetch=async()=>({ok:true,json:async()=>[]});vm.createContext(context);`);
harness+=`(async()=>{
 const query='嘉義縣朴子市山通路11號';
 const centers=JSON.parse(fs.readFileSync('center-addresses.json','utf8'));assert.equal(Object.keys(centers).length,13);
 for(const [name,address] of Object.entries(centers)){context.centerName=name;context.centerAddress=address;assert(vm.runInContext('suppliedPlaces.includes(centerName)',context));assert.equal(vm.runInContext('placeAddress(centerName)',context),address);assert(vm.runInContext('placeMatches(centerName,placeSearchKey(centerAddress))',context));}
 let error;try{await vm.runInContext('geocode('+JSON.stringify(query)+')',context);}catch(e){error=e;}
 assert.equal(error.locationQuery,query);assert(!error.message.includes('請補上縣市'));
 ids.stops.querySelectorAll('input')[0].value=query;context.failure=error;vm.runInContext('status(failure.message,true,failure.locationQuery)',context);
 const link=ids.status.children.find(e=>e.tag==='a');assert(link);assert.equal(new URL(link.href).pathname,'/maps/dir/');assert.equal(new URL(link.href).searchParams.get('origin'),ids.origin.value);assert.equal(new URL(link.href).searchParams.get('destination'),query);vm.runInContext('addStop("嘉義縣政府")',context);const multi=new URL(vm.runInContext('googleDirectionsUrl()',context));assert.equal(multi.searchParams.get('waypoints'),query);assert.equal(multi.searchParams.get('destination'),'嘉義縣政府');ids.mode.value='scooter';assert.equal(new URL(vm.runInContext('googleDirectionsUrl()',context)).searchParams.get('travelmode'),'two-wheeler');assert.equal(link.target,'_blank');
 vm.runInContext('invalidate()',context);assert.equal(ids.status.children.length,0);
 context.fetch=async()=>{throw Error('服務連線失敗');};
 try{await vm.runInContext('geocode('+JSON.stringify(query)+')',context);assert.fail();}catch(e){assert.equal(e.locationQuery,query);}
 context.fetch=async()=>({ok:true,json:async()=>[{lat:'23.4',lon:'120.2',display_name:'嘉義縣測試地址'}]});
 const approximate=await vm.runInContext('geocode('+JSON.stringify(query)+')',context);assert.equal(approximate.approximate,true);assert.equal(approximate.lat,23.4);context.fetch=async()=>({ok:true,json:async()=>[{lat:'23.4',lon:'120.2',display_name:query}]});const point=await vm.runInContext('geocode('+JSON.stringify(query)+')',context);assert.equal(point.lat,23.4);
 for(const path of ['index.html','出差旅費計算工具.html'])assert(fs.readFileSync(path,'utf8').includes(fs.readFileSync('app.js','utf8')));
 console.log('PASS: no-result recovery, encoded Google search, clearing stale action, service failure, successful lookup, HTML sync');
})();`;
new Function('require',harness)(require);
