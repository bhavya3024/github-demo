$(document).ready(function(){
var $firstName, $lastName, $email, $password, $errorFirstName,
$errorLastName,$errorEmail,$errorPassword,$alreadyExists, allSet, data;
$("#submit").click(function(event)
{
allSet = true;
event.preventDefault();
$firstName = $("#firstName");
$lastName = $("#lastName");
$email = $("#textEmail");
$password = $("#textPassword");
$errorFirstName = $("#errorFirstName");
$errorLastName = $("#errorLastName");
$errorEmail = $("#errorEmail");
$errorPassword = $("#errorPassword");
$alreadyExists = $("#alreadyExists");
if($firstName.val().length === 0)
{
    $errorFirstName.text("Please enter first name");
    allSet= false;
}
else{
    $errorFirstName.text("");
}
if($lastName.val().length === 0)
{
    $errorLastName.text("Please enter last name");
    allSet = false;
}
else{
    $errorLastName.text("");
}
if($email.val().length === 0)
{
    $errorEmail.text("Please enter Email");
    allSet= false;
}
else{
    $errorEmail.text("");
}
if($password.val().length === 0)
{
    $errorPassword.text("Please enter password");
    allSet=false;
}
else if($password.val().length < 8 && $password.val().length > 0)
{
    $errorPassword.text("Password should have atleast 8 characters");
    allSet=false;
}
else{
    $errorPassword.text("");
}
if(allSet === true)
{
    data = {
      firstName:$firstName.val(),
      lastName:$lastName.val(),
      email:$email.val(),
      password:$password.val()       
    };
   $.ajax({
    url:'http://localhost:8080/register',
    type:'POST',
    data:JSON.stringify(data),
    contentType:"application/json",
    success:function(data)
    {
      window.location.href = 'welcome.html';
      $alreadyExists.text(data);
    },
    error: function(jqXHR,textStatus,errorThrown)
    {
        $alreadyExists.text(jqXHR.responseText);
    }
});
}
});
});