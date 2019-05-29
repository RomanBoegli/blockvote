/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global getAssetRegistry getFactory emit */



/**
 * vote transaction processor function.
 * @param {org.example.basic.vote} vt The vote instance.
 * @transaction
 */
async function vote(vt){
  
  var lExit = false;
  

  /***VALIDATION***/
  
  //check if voter is authorized to vote
  if(!validSignature(vt)) {
    lExit = true;
    invalidVote(vt, "invalid signature", "The voter may not be pre-registred.")
  }
  
  //check if voter did not already participate in this poll
  const optionRegistry = await getAssetRegistry('org.example.basic.Option');
  const options = await optionRegistry.getAll();
  if(doubleVote(vt, options)){
    lExit = true;
	invalidVote(vt, "double vote", "This voter already participated in this poll.")
  }
  
    
  /***EXECUTION***/
  if(!lExit){
  	//register the vote on the poll's option
  	const Option = await getAssetRegistry('org.example.basic.Option');
  	vt.option.voters.push(vt.voter);
  	await Option.update(vt.option)
  }
  
}

/**
 * count transaction processor function.
 * @param {org.example.basic.count} tx the count instance.
 * @transaction
 */
async function count(tx) {
  
  var lExit = false;
  var totalVotes = 0;
  var leader = 0;
  var winningOption = "";
  var stats = [];

  
  const optionRegistry = await getAssetRegistry('org.example.basic.Option');
  const options = await optionRegistry.getAll();
  
  var i = 0
  while( (i < options.length) && (!lExit) ){
    
    if(options[i].poll.getIdentifier() == tx.poll.pollID){
      //relevant option found...
      
      var optionId = options[i].getIdentifier();
      var optionLength = options[i].voters.length;
      
      //increase totalVoters
      totalVotes = totalVotes + options[i].voters.length;
      
      //assess winner
      if(optionLength == leader){
        winningOption = "not defined yet";
      } else {
        if(optionLength > leader){
          leader = optionLength;
          winningOption = optionId;
        }
      }
      
      //do the stats
      stats.push( [ optionId , optionLength  ] );

    }
    
    i++; 
  }
  
  currentResult(tx.poll, winningOption, stats);
}

//incomplete
function validSignature(vt) {
  
  var lReturn = false;
  
  var regVoters = 	[ "ABCD",
                      "EFGH",
                      "LMNO",
                      "PQRS",
                      "TUVW",
                      "XYZA"  ];
  
  
  if(regVoters.includes(vt.voter.publickey)){
  	//check the signature
    lReturn = true;
  }
  
  return lReturn
}

function doubleVote(vt, options){
  
  //assume it's not a double vote
  var lReturn = false;
  
  //find the options belonging to the poll
  var i = 0
  while( (i < options.length) && (!lReturn) ){
 
    if(options[i].poll.getIdentifier() == vt.option.poll.pollID){
      
      //loop through the voters who voted for that option
      var n = 0
      while( (n < options[i].voters.length) && (!lReturn) ){
        if(options[i].voters[n].getIdentifier() == vt.voter.voterID){
          //it's a double vote
          lReturn = true;
        }
        n++;
      }  
                 
    }
    i++;
  }
 
  return lReturn;
}

function invalidVote(vt, lbl, msg){
  let event = getFactory().newEvent('org.example.basic', 'invalidVote');
  event.v = vt.voter;
  event.p = vt.option.poll;
  event.o = vt.option;
  event.lbl = lbl;
  event.msg = msg;
  emit(event); 
}

function debug(msg){
  let event = getFactory().newEvent('org.example.basic', 'debug');
  event.c = msg;
  emit(event);
}

function currentResult(poll, winningOption, stats){
  let event = getFactory().newEvent('org.example.basic', 'currentResult');
  event.p = poll;
  event.winningOption = winningOption;
  event.stats = stats.toString();
  emit(event); 
}
