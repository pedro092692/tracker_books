function alertDeleteBook(e, form){
    //prevent send form 
    e.preventDefault();
    let confirmDelete = confirm('Are you sure to delete this book of your library?');
    //submit form if user confirm
    if(confirmDelete){
        form.submit();
    }
}