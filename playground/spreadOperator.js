const state = {
  addTransaction: false,
  editTransaction: false,
  selectedTrasactionIds: [1,2]
};


const addId = (id) => {
  return [...state.selectedTrasactionIds,
    id]
}

const removeId = (id) => {
  return state.selectedTrasactionIds.filter((selectedId)=>{ return selectedId!==id});
}

const runlist = async () => {
  await console.log(addId(1));
   state.selectedTrasactionIds = addId('asdf');
  await console.log(addId(123));
  await console.log(state);
  await console.log('remove ',removeId(4));

}

//runlist();

const user = { "id": "test",
                "email":"abc123",
                "tokens":[{"access":"auth","token":"overwriteMe"},{"access":"test","token":"doNotOverwriteMe"}]
              };
  const user2 = { "id": "test",
  "email":"abc123",
  "tokens":[{"access":"test","token":"doNotOverwriteMe"}]
};
access = "auth";
token = "overwritten";
let userTokens = user2.tokens;
console.log(user2.tokens);
console.log('tokens 2');
const tokens2 = [...userTokens];
console.log(tokens2);
console.log('loop');
let accessCount=0
Object.keys(userTokens).forEach((key)=>{
  if(userTokens[key].access === access){
    userTokens[key].token = token;
    accessCount++;
  };
});

if (accessCount === 0){
  userTokens = [...userTokens, {access, token}]
}

console.log(userTokens, accessCount);

tokenb = "mapOverwritten";
userTokens = user2.tokens;
let accessCountMap=0;
userTokens.map((tokeninMap)=>{
  if(tokeninMap.access === access){
    tokeninMap.token = token;
    accessCountMap++;
  }  
});

if (accessCount === 0){
  userTokens = [...userTokens, {access, token}]
}


console.log("map");
console.log(userTokens, accessCount);





//console.log("state = ", [...state.selectedTrasactionIds, 4]);