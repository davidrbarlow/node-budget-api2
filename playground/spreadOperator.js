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

runlist();

//console.log("state = ", [...state.selectedTrasactionIds, 4]);