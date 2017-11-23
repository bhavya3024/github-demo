$(document).ready(function(){
function getDetails(){
    $.ajax({
        url:'http://localhost:8080/getGeneralDetails',
        type:'GET',
        success:function(data){
           $("#firstName").val(data.firstName);
           $("#lastName").val(data.lastName);
           $("#email").val(data.email);
           $("#profilePicture").attr("src",data.profilePicture);
        },
        error:function(jqXHR){
          alert(jqXHR.responseText);
        }
     });
}
$("#menuGeneral").click(function(){
   $(".changeGeneral").slideToggle();
   getDetails();
});
$("#menuPicture").click(function(){
    $(".changePicture").slideToggle();
    getDetails();
});
$("#menuPassword").click(function(){
    $(".changePassword").slideToggle();
});
function addDeleteMembers(){
    $.ajax({
        url:'/addDeleteMembers',
        type:'POST',
        data:{
            groupName:$("#groups").find("option:selected").val()
        },
        success:function(data){
            $(".deleteMembers").empty();
            $(".addMembers").empty();
            var replaceId, equal,add=[],del=[];
            for(let i = 0; i<data.members.length;i++){
                equal = false;
                for(let j = 0;j<data.present.length;j++){
                 if(data.present[j].email === data.members[i].email){
                $(".deleteMembers").append("<label class = 'deleteMember' ><input type='checkbox' value ="+data.members[i].email+">"+data.members[i].name+" ("+data.members[i].email+")</label>");
                equal = true;
                break;
               }   
             }
            if(equal === false){
                $(".addMembers").append("<label class = 'addMember'><input type='checkbox' value = "+data.members[i].email+">"+data.members[i].name+" ("+data.members[i].email+")</label>");        
            }
           }
           if($(".deleteMembers").find(".deleteMember").length>0){
               $("#buttonDeleteMembers").css("display","inline");
               $("#labelDeleteGroupMembers").show();
           }
           else{
            $("#buttonDeleteMembers").css("display","none");
            $("#labelDeleteGroupMembers").hide();
           }
           if($(".addMembers").find(".addMember").length >0){
               $("#buttonAddMembers").css("display","block");
               $("#labelAddGroupMembers").show();
           }
           else{
               $("#buttonAddMembers").css("display","none");
               $("#labelAddGroupMembers").hide();
           }
        },
        error:function(jqXHR){
              console.log(jqXHR.responseText);
        }   
    });
}
$("#buttonAddMembers").click(function(){
    var members = [], count =0;
   $(".addMember").each(function(){
      if($(this).find("input[type=checkbox]").is(":checked")){
         members.push({
             email:$(this).find("input[type=checkbox]").attr('value'),
             name:$(this).text().substring(0,$(this).text().lastIndexOf(' '))
         });
        count++;
    }
});
if(count === 0)
{
    alert('Please select atleast one group member to add');
}
else{
$.ajax({
   url:'/addMembers',
   type:'PUT',
   data:{
       groupName:$("#groups").find("option:selected").val(),
       newMembers:members,
   },
   success:function(data){
       alert(data);
       addDeleteMembers();
   },
   error:function(jqXHR){
     alert(jqXHR.responseText);
   }
  });
}
});
$("#buttonDeleteMembers").click(function(){
    var members = [],count = 0;
   $(".deleteMember").each(function(){
      if($(this).find("input[type=checkbox]").is(":checked")){
          members.push({
            email:$(this).find("input[type=checkbox]").attr('value'),
            name:$(this).text().substring(0,$(this).text().lastIndexOf(' '))
          });
          count++;
      }
    });
    if(count === 0)
    {
        alert('Please select alteast one group member to delete group members');
    }
    else{
      $.ajax({
          url:'/deleteMembers',
          type:'PUT',
          data:{
             groupName:$("#groups").find("option:selected").val(),
             deleteMembers:members 
          },
          success:function(data){
            alert(data);
            addDeleteMembers();
          },
          error:function(jqXHR){
           alert(jqXHR.responseText);
          }    
      });
    }
});
function checkAdmin(){
$.ajax({
    url:'/checkAdmin',
    type:'POST',
    data:{
        groupName:$("#groups").find("option:selected").val()
    },
    success:function(data){
      if(data === 'Y'){
       $(".adminGroupSettings").css("display","block");  
       addDeleteMembers();
      }
    },
    error:function(jqXHR){

    }
});
}
function showGroups(){
    $.ajax({
        url:'/showGroups',
        type:'GET',
        success:function(data){
               $("#groups").empty();
               $("#groups").append("<option value ='--Select--'>--Select--</option>"); 
           for(let i = 0; i<data.length;i++){
               $("#groups").append("<option>"+data[i].groupName+"</option>");            
           }
           $("#groups").change(function(){
             if($(this).val() !== '--Select--'){
                $('.changeGroupSettings').slideDown();
                $('#groupName').val($(this).val());
                $("#groupProfilePicture").attr("src",data[$(this).prop('selectedIndex')-1].groupProfilePicture);  
                checkAdmin();
             }
             else{
                  $('.changeGroupSettings').slideUp();

             } 
     });  
        },
        error:function(jqXHR){
              alert('Error finding groups');
        }
    });
}
$("#menuGroup").click(function(){
    $(".groupSettings").slideToggle();
      $('.changeGroupSettings').hide();
      showGroups();
});
$("#buttonChangeGroupName").click(function(){
    if($(this).text() === "Change"){
        $(this).text("Apply");
        $("#groupName").prop("disabled",false);
        $("#buttonChangeGroupCancel").css("display","block");
}
else{
    if($("#groupName").val() === ""){
        alert("Group name cannot be empty!");
    }
    else{
   $.ajax({
      url:'/changeGroupName',
      type:'PUT',
      data:{
          oldGroupName:$("#groups").find("option:selected").text(),
          newGroupName:$("#groupName").val()
      },
      success:function(data){
         alert(data);
         $("#groups").find("option:selected").text($("#groupName").val());
         $("#groupName").prop("disabled",true);
         $("#buttonChangeGroupCancel").css("display","none");
         $("#buttonChangeGroupName").text("Change");
      },
      error:function(jqXHR){
         alert(jqXHR.responseText);
      }
   });
}
}
});
$("#buttonChangeGroupCancel").click(function(){
   $(this).css("display","none");
   $("#buttonChangeGroupName").text("Change");
});
$("#buttonGeneralChange").click(function(){
  if($(this).text() === "Change"){
     $(this).text("Submit");
     $("#buttonGeneralCancel").css("visibility","visible");
     $("#firstName,#lastName,#email").prop("disabled",false);
  }
  else{
      var firstName,lastName,email,errorFirstName,errorLastName,errorEmail,allSet=true;
      firstName = $("#firstName");
      lastName = $("#lastName");
      email = $("#email");
      errorFirstName = $("#errorFirstName");
      errorLastName = $("#errorLastName");
      errorEmail = $("#errorEmail");
      if(firstName.val() === ""){
        allSet = false;
        errorFirstName.text("First Name cannot be empty");
      }
      else{
        errorFirstName.text("");  
      }
      if(lastName.val() === ""){
       allSet = false;
       errorLastName.text("Last Name cannot be empty");
      }
      else{
        errorLastName.text("");
      }
      if(email.val() === ""){
       allSet = false;
       errorEmail.text("Email cannot be empty");
      }
      else if(email.val().indexOf('@') === -1){
        allSet = false;
        errorEmail.text("Email is invalid");
      }
      else{
        errorEmail.text(""); 
      }
      if(allSet === true){ 
        $.ajax({ 
         url:'/changeGeneral',
         type:'PUT',
         data:{
         firstName:firstName.val(),
         lastName:lastName.val(),
         email:email.val()
         },
         success:function(data){
            $("#buttonGeneralChange").text("Change");
            $("#buttonGeneralCancel").css("visibility","hidden");
            $("#firstName,#lastName,#email").prop("disabled",true);
         },
         error:function(jqXHR){
           alert(jqXHR.responseText);
         }
       });
  }
}
});
$("#buttonGeneralCancel").click(function(){
    $(this).css("visibility","hidden");
    $("#buttonGeneralChange").text("Change");
    $("#firstName,#lastName,#email").prop("disabled",true);
    getDetails();
    $("#errorFirstName,#errorLastName,#errorEmail").text("");
});
$("#buttonPicture").click(function(){
   $("#filePicture, #buttonPictureCancel").css("display","block");
   $(this).hide();
});
$("#buttonGroupPicture").click(function(){
    $("#groupFilePicture,#buttonGroupPictureCancel").css("display","block");
    $(this).hide();
});
$("#buttonGroupPictureCancel").click(function(){
    $(this).css("display","none");
    $("#groupFilePicture").css("display","none");
    $("#groupFilePicture").val("");
    $("#buttonGroupPicture").show();
});
$("#buttonPictureCancel").click(function(){
  $(this).css("display","none");
  $("#filePicture").css("display","none");
  $("#filePicture").val("");
  $("#buttonPicture").css("display","block");
});
$("#groupFilePicture").change(function(){
   var fileName = $(this).val().split('\\').pop();
   if(this.files && this.files[0]){
       var reader = new FileReader();
       reader.onload = function(e){
           $.ajax({
              url:'/changeGroupProfilePicture',
              type:'PUT',
              data:{
               groupProfilePicture:'/file/'+fileName,
               fileData:e.target.result,
               file:fileName,
               groupName:$("#groups").find("option:selected").text()
              },
              success:function(data){
                console.log(data);
                  $("#groupProfilePicture").attr("src",data[0].groupProfilePicture);
                  $("#buttonGroupPictureCancel,#groupFilePicture").css("display","none");
                  $("#buttonGroupPicture").css("display","block");
              },
              error:function(jqXHR)
              {
                  console.log(jqXHR.responseText);
              }
           });
       }
       reader.readAsDataURL(this.files[0]);   
    }
});
$("#filePicture").change(function(){
    var fileName = $(this).val().split('\\').pop();
   if(this.files && this.files[0]){
       var reader = new FileReader();
       reader.onload = function(e){
           $.ajax({
               url:'/changeProfilePicture',
               type:'PUT',
               data:{
                profilePicture:'/file/'+fileName,
                fileData:e.target.result,
                file:fileName
               },
               success:function(data){
                   alert(data);
                   $("#filePicture, #buttonPictureCancel").css("display","none");
                   $("#buttonPicture").css("display","block");
                   getDetails();
               },
               error:function(jqXHR)
               {
                   alert(jqXHR.responseText);
               }
           });
       }
       reader.readAsDataURL(this.files[0]);
   }
});
$("#filePicture,#groupFilePicture").click(function(){
    $(this).val("");
});
$("#buttonSubmit").click(function(e){
    var oldPassword, newPassword, confirmPassword,errorOldPassword,errorNewPassword,errorConfirmPassword, allSet;
    oldPassword = $("#oldPassword");
    newPassword = $("#newPassword");
    confirmPassword = $("#confirmPassword");
    errorOldPassword = $("#errorOldPassword");
    errorNewPassword = $("#errorNewPassword");
    errorConfirmPassword = $("#errorConfirmPassword");
    e.preventDefault();
    allSet = true;
if(oldPassword.val() === ""){
    errorOldPassword.text("Please enter old password");
    allSet = false;
}
else{
   errorOldPassword.text("");
}
if(newPassword.val() === ""){
    errorNewPassword.text("Please enter new password");
    allSet = false;
}
else{
    errorNewPassword.text("");
}
if(confirmPassword.val() === ""){
   errorConfirmPassword.text("Please enter confirm password");   
   allSet =  false;
}
else{
    errorConfirmPassword.text("");
 }
if(allSet === true){
    var match;
     if(confirmPassword.val() !== newPassword.val()){ 
        match = "Passwords should match";
        allSet = false;
     }
     else{
         errorConfirmPassword.text("");
      }
     if(confirmPassword.val().length < 8 || newPassword.val() < 8)
     {
        if(match === undefined)
        {
            match = "Passwords should have atleast 8 characters";
        }
        else{
            match = match + " and have atleast 8 characters";
        }
        allSet = false;
      }else{
      errorConfirmPassword.text("");
      }
      errorConfirmPassword.text(match);
}
if(allSet === true){
    if(oldPassword.val() === newPassword.val())
    {
        errorConfirmPassword.text("To change the password, new password should not be equal to the old passowrd");
    }
    else{
      errorConfirmPassword.text("");
       $.ajax({
           url:'/changePassword',
           type:'PUT',
           data:{
               oldPassword:oldPassword.val(),
               newPassword:newPassword.val()
           },
           success:function(data){
               alert(data);
               errorConfirmPassword.text("");
               window.location.href = '/main/logIn.html';
           },
           error:function(jqXHR,textStatus,errorThrown){
               errorConfirmPassword.text(jqXHR.responseText);
           }
       });
    }
}
});
});
