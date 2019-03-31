$(document).ready(function(){
  var key,content,contacts,email,name,currentName,currentEmail,date,month,upload,socket=io(),profilePicture,groupName;
$("#buttonSettings").click(function(){
 window.location.href='/user/changeSettings.html';
});
function loadGroupMessage(groupName){
    socket.emit('loadGroupMessage',groupName);
}
function loadMessage(){
    var data = {
        from:currentEmail,
        to:email
    };
  socket.emit('loadMessages',data);
  socket.on('messages',function(data){
    $(".messageContent").empty();
    for(let i = 0; i<data.length;i++){
     if(data[i].message){
        date = new Date(data[i].date);
        month = date.getMonth()+1;
    $(".messageContent").append("<div class='msg'><b>"+data[i].fromName+":</b> "+data[i].message+
    "<br><div class='msgStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");
    } 
    if(data[i].link){
     date = new Date(data[i].date);
     month = date.getMonth()+1;
    if(data[i].link.split('.').pop()==='png'||data[i].link.split('.').pop()==='jpg'||data[i].link.split('.').pop()==='jpeg'){
        $(".messageContent").append("<div class= 'imageContent'><b class='imageFrom'>"+data[i].fromName+"</b><img class='image' src="+data[i].link+"></img>"+
        "<br><div class='imageStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");
    }
    else{
    $(".messageContent").append("<div class='documentContent'><b class='documentFrom'>"+data[i].fromName+"</b><object class='document' data="+data[i].link+"></object>"+
    "<br><div class='documentStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");    
        }               
    }
    }
});
}
socket.on('groupMessages',function(data){
   $(".messageContent").empty();
   for(let i = 0; i<data.length;i++){
    if(data[i].groupMessage){
       date = new Date(data[i].date);
       month = date.getMonth()+1;
   $(".messageContent").append("<div class='msg'><b>"+data[i].from.name+":</b> "+data[i].groupMessage+
   "<br><div class='msgStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");
   } 
   if(data[i].link){
    date = new Date(data[i].date);
    month = date.getMonth()+1;
   if(data[i].link.split('.').pop()==='png'||data[i].link.split('.').pop()==='jpg'||data[i].link.split('.').pop()==='jpeg'){
       $(".messageContent").append("<div class= 'imageContent'><b class='imageFrom'>"+data[i].from.name+"</b><img class='image' src="+data[i].link+"></img>"+
       "<br><div class='imageStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");
   }
   else{
   $(".messageContent").append("<div class='documentContent'><b class='documentFrom'>"+data[i].from.name+"</b><object class='document' data="+data[i].link+"></object>"+
   "<br><div class='documentStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");    
       }               
   }
   }
});
socket.on('newGroupMessage',function(data){
    date = new Date(data.date);
    month = date.getMonth() +1;
    if(data.groupMessage){
    $(".messageContent").append("<div class='msg'><b>"+data.from.name+":</b> "+data.groupMessage+
    "<br><div class='msgStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");
    } 
    if(data.link){
     date = new Date(data.date);
     month = date.getMonth()+1;
    if(data.link.split('.').pop()==='png'||data.link.split('.').pop()==='jpg'||data.link.split('.').pop()==='jpeg'){
        $(".messageContent").append("<div class= 'imageContent'><b class='imageFrom'>"+data.from.name+"</b><img class='image' src="+data.link+"></img>"+
        "<br><div class='imageStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");
    }
    else{
    $(".messageContent").append("<div class='documentContent'><b class='documentFrom'>"+data.from.name+"</b><object class='document' data="+data.link+"></object>"+
    "<br><div class='documentStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");    
     }               
    }
});
function sendMessage(link){
    if(link === undefined){
        link = '';
    }
    else{
        link = '/file/'+link;
    }
    var data = {
        fromName:currentName,
        fromEmail:currentEmail,
        toEmail:email,
        toName:name,
        message:$("#message").val(),
        date:new Date(),
        link:link
    };
    socket.emit('sendMessage',data); 
}
socket.on('newMessage',function(data){
    date = new Date(data.date);
    month = date.getMonth()+1;
    if(data.message){
   $(".messageContent").append("<div class='msg'><b>"+data.fromName+":</b> "+data.message+
   "<br><div class='msgStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");
   } 
   if(data.link){
   if(data.link.split('.').pop()==='png'||data.link.split('.').pop()==='jpg'||data.link.split('.').pop()==='jpeg'){
       $(".messageContent").append("<div class='imageContent'><b class='imageFrom'>"+data.fromName+"</b><img class ='image' src="+data.link+"></img>"+
       "<br><div class='imageStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");
   }
   else{
   $(".messageContent").append("<div class='documentContent'><b class='documentFrom'>"+data.fromName+"</b><br><object class='document' data="+data.link+"></object>"+
   "<br><div class='documentStatus'>"+' '+date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+"<span class='glyphicon glyphicon-ok-circle'></span></div></div>");    
    }               
   }  
});
function sendGroupMessage(link){
    if(link === undefined){
        link = '';
    }
    else{
        link = '/file/'+link;
    }
    var data={
        from:{
            name:currentName,
            email:currentEmail
        },
        groupName:$(".detailName").text(),
        message:$("#message").val(),
        date:new Date(),
        link:link
    }
    socket.emit('groupMessage',data);    
}
function sendFile(f){
    var data  = {
        file:f,
        fileName:upload
    };
    socket.emit('sendFile',data);
    socket.on('newFileName',function(data){
        if($(".details").find(".groupMembers").length>0){
        sendGroupMessage(data);
        }
        else{
        sendMessage(data);
        }      
    });
}
$("#message").keypress(function(e){
  date = new Date();
  if(e.key === 'Enter'){
      content = $("#message").val();
      if(content !== null){
          if($(".details").find(".groupMembers").length >0){
            sendGroupMessage();
            content = "";
            $('#message').val('');
          } 
          else{
          sendMessage();
          content = "";
           $('#message').val('');
          }          
      }
      else{
      }
  }
});
$.ajax({
   url:'/contacts',
   type:'GET',
   success:function(data){
   var room;
   contacts = data.contacts;
    currentName = data.currentName;
    $("#username").text("Welcome, "+data.currentName);
    currentEmail = data.currentEmail;
    profilePicture = data.profilePicture;
    $("#profilePicture").attr("src",profilePicture);
for(let i = 0; i<contacts.length; i++){
    $(".contactList").append("<a id ="+contacts[i]._id+">"+contacts[i].firstName+' '+contacts[i].lastName+"</a>"); 
    $("#"+contacts[i]._id).click(function(){
        $("#message").attr('contenteditable','true');
        $(".groupMembers").remove();
         $(".detailName").text(contacts[i].firstName +' '+contacts[i].lastName);
         email = contacts[i].email;
         name = contacts[i].firstName +' '+contacts[i].lastName;
         if(currentEmail<email)
          room = currentEmail+email;
          else  room = email+currentEmail;
          socket.emit('room',room);
          loadMessage();
        });
    }
    },
   error:function(jqXHR,textStatus,errorThrown){
    alert('no contacts');
   }
});
$.ajax({
    url:'/showGroups',
    type:'GET',
    success:function(data){
        for(let i = 0; i<data.length;i++){
            $(".groupList").append('<a id='+data[i]._id+'>'+data[i].groupName+'</a>');
            $("#"+data[i]._id).click(function(){
                var text="";
                $("#profilePicture").attr("src",data[i].groupProfilePicture);
                $("#message").attr('contenteditable','true');
                $(".detailName").text(data[i].groupName);
                loadGroupMessage(data[i].groupName);
                $(".groupMembers").remove();
                $(".details").append("<div class='groupMembers'></div>");
                for(var j  = 0; j<data[i].groupMembers.length;j++){
                    if(j === data[i].groupMembers.length-1){
                      text = text + data[i].groupMembers[j].name;
                    }
                    else{
                      text = text + data[i].groupMembers[j].name + ", ";
                    }
                }
                $(".groupMembers").text(text);
                socket.emit('groupRoom',data[i].groupName);
            });
        }
    },
    error:function(jqXHR){

    }
   });   
$("#buttonLogOut").click(function(){
$.ajax({
   url:"/logOut",
   type:'GET',
   success:function(data){
      window.location.href='/main/welcome.html';
   },
   error:function(){
       
   }
});
});
$("#imageUpload").click(function(){
   $(this).val("");
});
$("#imageUpload").change(function(){
  if (this.files && this.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
        upload = $("#imageUpload").val().split('\\').pop();
        sendFile(e.target.result);
    };
    reader.readAsDataURL(this.files[0]);
}
});
$("#documentUpload").click(function(){
    $(this).val("");
});
$("#documentUpload").change(function(){
   if(this.files && this.files[0]){
       var reader = new FileReader();
       reader.onload = function(e){
        upload = $("#documentUpload").val().split('\\').pop();
        sendFile(e.target.result);
       }
       reader.readAsDataURL(this.files[0]);
}
});
});


