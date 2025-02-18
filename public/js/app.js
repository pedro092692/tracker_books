function alertDeleteBook(e, form, msg){
    //prevent send form 
    e.preventDefault();
    let confirmDelete = confirm(msg);
    //submit form if user confirm
    if(confirmDelete){
        form.submit();
    }
}

function editNote(edit){
    
    const form = document.getElementById('editNoteForm');
    const deleteForm = document.getElementById('deleteNoteForm');
    const divInfo = document.getElementById('noteInfo');
    const leaveEdit = document.getElementById('leaveEdit');
    if(edit){
        divInfo.style.display = 'none';
        form.style.display = 'block';
        leaveEdit.style.display = 'block';
        deleteForm.style.display = 'block';
    }else{
        form.style.display = 'none';
        divInfo.style.display = 'block';
        leaveEdit.style.display = 'none';
        deleteForm.style.display = 'none';
    }
    
}

function filterForm(select){
    const form = select.parentNode;
    form.submit();
}