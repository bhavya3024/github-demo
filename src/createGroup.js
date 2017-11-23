$(document).ready(function(){   
function getSelectedMembers(data){
    $("#buttonCreateGroup").click(function(){
        var members = [] ,groupName,errorGroupName,errorGroupMembers, allSet = true;
        groupName = $("#groupName");
        errorGroupName = $("#errorGroupName");
        errorGroupMembers = $("#errorGroupMembers");
        if(groupName.val() === "")
        {
            allSet = false;
            errorGroupName.text("Please enter your group  name");
        }
        else{
            errorGroupName.text("");
        }
        $("input[type=checkbox]").each(function(i){
            if($(this).is(":checked")){
                members.push({
                    name:data[i].firstName +' '+data[i].lastName,
                    email:data[i].email
                });
            }
        });
        if(members.length === 0){
            allSet = false;
            errorGroupMembers.text("Please select atleast one member");
        } 
        else{
            errorGroupMembers.text("");
        }
        if(allSet === true){
           $.ajax({
                 url:'/createGroup',
                 type:'POST',
                 data:{
                     name:groupName.val(),
                     members:members             
                 },
                 success:function(data){
                    alert(data);
                    window.location.href = "/user/profile.html";
                 },
                 error:function(jqXHR){
                   alert(jqXHR.responseText);
                 }  
               });
        }
});
}    
$.ajax({
     url:'/showMembers',
     type:'GET',
     success:function(data){ 
         $(".groupMembers").append("<ul>");
         for(let i = 0; i<data.length; i++){
             $(".groupMembers").append('<div class="member"><li><input type="checkbox" id='+data[i].email.replace('@','').replace('.','')+'><p>'
             +data[i].firstName+' '+data[i].lastName+' ('+data[i].email+')'+'</p></li></div>');}
     $(".groupMembers").append("</ul>");
     getSelectedMembers(data);  
    },
    error:function()
    {
    }
});
});
