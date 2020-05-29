console.log("Connected");

// Pure JQuery
// $(document).ready(function(){
//     $('.delete-article').on('click',function(e){
//         $target = $(e.target);
//         const id = $target.attr('data-id');

//         $.ajax({
//             type:'DELETE',
//             url : `/delete/${id}`,
//             success : function(response){
//                 alert('Deleting Article');
//                 window.location.href ='/';
//             },
//             error: function(err){
//                 console.log(err);
                
//             }
//         })

//     });
// });


document.querySelector('.delete-article').addEventListener('click',(e)=>{
    const id = e.target.id;
    console.log(id);

    $.ajax({
        type:'DELETE',
        url : `/delete/${id}`,
        success : function(response){
            alert('Deleting Article');
            window.location.href ='/';
        },
        error: function(err){
            console.log(err);
            
        }
    })
    
})
