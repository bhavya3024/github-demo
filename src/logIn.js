$(document).ready(function(){
var $email,$password,$errorEmail,$errorPassword,$loginError, allSet, data;
$("#submit").click(function(event){
event.preventDefault();
allSet = true;
$email = $("#email");
$password = $("#password");
$errorEmail = $("#errorEmail");
$errorPassword = $("#errorPassword");
$loginError = $("#loginError");
if($email.val().length === 0)
{
    $errorEmail.text("Please enter your email");
    allSet = false;
}
else{
    $errorEmail.text("");
}
if($password.val().length === 0)
{
    $errorPassword.text("Please enter your password");
    allSet = false;
}
else{
    $errorPassword.text("");
}
if(allSet === true)
{
data = {
    email:$email.val(),
    password:$password.val()
}    
$.ajax({
url:'http://localhost:8080/authenticate',
type:'POST',
data:JSON.stringify(data),
contentType:'application/json',
success:function(data)
{ 
    window.location.href = '../user/profile.html';
},
error:function(jqXHR,textStatus,errorThrown)
{
    $loginError.text(jqXHR.responseText);
}
});
}
});
});